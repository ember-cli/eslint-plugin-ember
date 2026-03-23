/**
 * Benchmark script using mitata.
 *
 * Measures the time to lint Ember files of various sizes using the
 * recommended config (base for .js, gjs for .gjs, gts for .gts).
 *
 * When run standalone (`node --expose-gc tests/lint.bench.mjs`), it benchmarks
 * the local plugin only. When `bench-compare.mjs` passes `--control-dir <dir>`,
 * it also loads the control (base-branch) plugin from that directory and wraps
 * each size in a `summary()` so mitata shows a side-by-side comparison with
 * boxplots.
 *
 * Usage:
 *   node --expose-gc tests/lint.bench.mjs [--control-dir <path>]
 */

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { run, bench, boxplot, summary, do_not_optimize as doNotOptimize } from 'mitata';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const ctrlIdx = args.indexOf('--control-dir');
const CONTROL_DIR = ctrlIdx !== -1 ? resolve(args[ctrlIdx + 1]) : null;

// ---------------------------------------------------------------------------
// Build ESLint Linter configs for experiment (current branch)
// ---------------------------------------------------------------------------

const require_ = createRequire(import.meta.url);

function buildConfigs(pluginPath, parserPath) {
  const plugin = require_(pluginPath);
  const parser = require_(parserPath);

  const baseRulesPath = resolve(pluginPath, '../recommended-rules.js');
  const gjsRulesPath = resolve(pluginPath, '../recommended-rules-gjs.js');
  const gtsRulesPath = resolve(pluginPath, '../recommended-rules-gts.js');

  // Clear require cache to ensure fresh loads when comparing control vs experiment
  delete require_.cache[require_.resolve(baseRulesPath)];
  delete require_.cache[require_.resolve(gjsRulesPath)];
  delete require_.cache[require_.resolve(gtsRulesPath)];

  const baseRules = require_(baseRulesPath);
  const gjsRules = require_(gjsRulesPath);
  const gtsRules = require_(gtsRulesPath);

  return {
    js: {
      plugins: { ember: plugin },
      rules: { ...baseRules },
    },
    gjs: {
      plugins: { ember: plugin },
      languageOptions: {
        parser,
        parserOptions: {
          ecmaFeatures: { modules: true },
          ecmaVersion: 'latest',
        },
      },
      processor: plugin.processors.noop,
      rules: { ...baseRules, ...gjsRules },
    },
    gts: {
      plugins: { ember: plugin },
      languageOptions: {
        parser,
        parserOptions: {
          extraFileExtensions: ['.gts'],
        },
      },
      processor: plugin.processors.noop,
      rules: { ...baseRules, ...gtsRules },
    },
  };
}

const experimentConfigs = buildConfigs(
  resolve(fileURLToPath(import.meta.url), '../../lib/index.js'),
  'ember-eslint-parser',
);

// ---------------------------------------------------------------------------
// (Optionally) load control (base branch) plugin from tmp dir
// ---------------------------------------------------------------------------

let controlConfigs = null;

if (CONTROL_DIR) {
  const controlRequire = createRequire(resolve(CONTROL_DIR, 'index.js'));

  // Load control plugin and parser from the control directory
  const controlPluginPath = resolve(CONTROL_DIR, 'lib/index.js');
  const controlParserPath = resolve(CONTROL_DIR, 'node_modules/ember-eslint-parser');

  controlConfigs = buildConfigs(controlPluginPath, controlParserPath);
}

// ---------------------------------------------------------------------------
// Fixture content
// ---------------------------------------------------------------------------

function fixture(name) {
  return readFileSync(fileURLToPath(new URL(`./bench/${name}`, import.meta.url)), 'utf8');
}

const FIXTURES = {
  js: { small: fixture('small.js'), medium: fixture('medium.js'), large: fixture('large.js') },
  gjs: { small: fixture('small.gjs'), medium: fixture('medium.gjs'), large: fixture('large.gjs') },
  gts: { small: fixture('small.gts'), medium: fixture('medium.gts'), large: fixture('large.gts') },
};

// ---------------------------------------------------------------------------
// Create Linter instances
// ---------------------------------------------------------------------------

// Use ESLint's Linter API for in-process linting
const { Linter } = require_('eslint');

function createLinter(configs, type) {
  const linter = new Linter({ configType: 'flat' });
  return { linter, config: configs[type] };
}

// ---------------------------------------------------------------------------
// Register benchmarks
// ---------------------------------------------------------------------------

const FILE_TYPES = [
  { type: 'js', ext: '.js' },
  { type: 'gjs', ext: '.gjs' },
  { type: 'gts', ext: '.gts' },
];

const SIZES = ['small', 'medium', 'large'];

// ---------------------------------------------------------------------------
// JIT warm-up — lint every fixture with both configs so V8 compiles and
// optimises the hot paths before any measurement begins.  Without this, the
// first-to-run config pays the JIT compilation cost, creating order bias.
// ---------------------------------------------------------------------------

const WARMUP_ROUNDS = 5;

for (const { type, ext } of FILE_TYPES) {
  const { linter: expLinter, config: expConfig } = createLinter(experimentConfigs, type);
  const ctrl = controlConfigs ? createLinter(controlConfigs, type) : null;

  for (const size of SIZES) {
    const code = FIXTURES[type][size];
    const filename = `${size}${ext}`;

    for (let i = 0; i < WARMUP_ROUNDS; i++) {
      expLinter.verify(code, expConfig, { filename });
      ctrl?.linter.verify(code, ctrl.config, { filename });
    }
  }
}

globalThis.gc?.();

// More iterations per sample → individual GC spikes get diluted, reducing
// variance on noisy CI runners.  Scale down for larger fixtures so each
// sample doesn't take too long (mitata needs many samples for stable stats).
// Linting is heavier than parsing — use fewer iterations per sample than a
// parser benchmark to keep each sample under a few seconds.  The .gjs/.gts
// files are linted faster (smaller rule sets), but we use the same counts
// to keep comparison fair across file types.
const BENCH_ITERS = { small: 50, medium: 25, large: 10 };

for (const { type, ext } of FILE_TYPES) {
  const { linter: expLinter, config: expConfig } = createLinter(experimentConfigs, type);
  const ctrl = controlConfigs ? createLinter(controlConfigs, type) : null;

  for (const size of SIZES) {
    const code = FIXTURES[type][size];
    const filename = `${size}${ext}`;
    const iters = BENCH_ITERS[size];

    // Force a full GC before each benchmark group to reduce GC-triggered variance
    globalThis.gc?.();

    if (ctrl) {
      // Side-by-side comparison with boxplots
      boxplot(() => {
        summary(() => {
          bench(`${type} ${size} (control)`, () => {
            for (let i = 0; i < iters; i++) doNotOptimize(ctrl.linter.verify(code, ctrl.config, { filename }));
          });
          bench(`${type} ${size} (experiment)`, () => {
            for (let i = 0; i < iters; i++) doNotOptimize(expLinter.verify(code, expConfig, { filename }));
          });
        });
      });
    } else {
      // Standalone mode — just benchmark the local plugin
      bench(`${type} ${size}`, () => {
        for (let i = 0; i < iters; i++) doNotOptimize(expLinter.verify(code, expConfig, { filename }));
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const result = await run({ colors: false, throw: true });

// Write JSON output if requested
const jsonPath = process.env.BENCH_JSON_OUTPUT;
if (jsonPath) {
  const { writeFileSync } = await import('node:fs');

  const benchmarks = result.benchmarks.map((trial) => ({
    alias: trial.alias,
    runs: trial.runs.map((r) => ({
      name: r.name,
      args: r.args,
      error: r.error ? { message: r.error.message || String(r.error) } : undefined,
      stats: r.stats
        ? {
            avg: r.stats.avg,
            min: r.stats.min,
            max: r.stats.max,
            p50: r.stats.p50,
            p75: r.stats.p75,
            p99: r.stats.p99,
            samples: r.stats.samples,
          }
        : undefined,
    })),
  }));

  writeFileSync(jsonPath, JSON.stringify({ context: result.context, benchmarks }, null, 2));
}
