/**
 * Format benchmark comparison results into a GitHub PR comment.
 *
 * Reads the plain-text mitata output and (optionally) the JSON results from
 * the bench run, then produces a GitHub-flavored markdown comment with:
 *   1. A summary table (when comparison data is available)
 *   2. Full mitata output in a collapsible <details> section
 *
 * Environment variables:
 *   BENCH_OUTPUT_FILE   - Path to the plain-text bench output
 *   BENCH_JSON_OUTPUT   - Path to the JSON bench results (optional)
 *   BENCH_JOB_SUCCESS   - Set to "true" if the benchmark job succeeded
 */

import { readFileSync } from 'node:fs';
import { formatTime, deltaEmoji, parsePairs, readBenchJSON } from './bench-utils.mjs';

const marker = '<!-- bench-compare -->';

// ---------------------------------------------------------------------------
// Read raw mitata output
// ---------------------------------------------------------------------------

let rawOutput;
try {
  rawOutput = readFileSync(process.env.BENCH_OUTPUT_FILE, 'utf8').trim();
} catch {
  console.warn('Warning: could not read BENCH_OUTPUT_FILE; using placeholder text.');
  rawOutput = '(no output — benchmark may have failed to start)';
}

// Strip any lines before the mitata header (safety net for leaked setup messages)
const benchStart = rawOutput.search(/^(clk:|benchmark\b)/m);
if (benchStart > 0) {
  rawOutput = rawOutput.slice(benchStart);
}

// ---------------------------------------------------------------------------
// Read JSON results (if available) and build summary
// ---------------------------------------------------------------------------

let summarySection = '';
const jsonPath = process.env.BENCH_JSON_OUTPUT;

if (jsonPath) {
  try {
    const rows = parsePairs(readBenchJSON(jsonPath));

    if (rows.length > 0) {
      const tableRows = rows.map(({ name, control, experiment, delta }) => {
        const emoji = deltaEmoji(delta);
        const sign = delta > 0 ? '+' : '';
        return `| ${emoji} | ${name} | ${formatTime(control)} | ${formatTime(experiment)} | ${sign}${delta.toFixed(1)}% |`;
      });

      summarySection = [
        '',
        '| | Benchmark | Control (p50) | Experiment (p50) | Δ |',
        '|---|---|---:|---:|---:|',
        ...tableRows,
        '',
        '> 🟢 faster · 🔴 slower · 🟠 slightly slower · ⚪ within 2%',
        '',
      ].join('\n');
    }
  } catch {
    // JSON not available or malformed — skip summary
  }
}

// ---------------------------------------------------------------------------
// Assemble comment
// ---------------------------------------------------------------------------

const success = process.env.BENCH_JOB_SUCCESS === 'true';
const heading = success ? '## 🏎️ Benchmark Comparison' : '## ❌ Benchmark Comparison (failed)';

const body = [
  marker,
  heading,
  summarySection,
  '<details>',
  '<summary>Full mitata output</summary>',
  '',
  '```',
  rawOutput,
  '```',
  '',
  '</details>',
].join('\n');

process.stdout.write(body + '\n');
