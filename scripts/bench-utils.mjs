/**
 * Shared utilities for benchmark formatting scripts.
 */

import { readFileSync } from 'node:fs';

export function formatTime(ns) {
  if (ns >= 1e6) return `${(ns / 1e6).toFixed(2)} ms`;
  if (ns >= 1e3) return `${(ns / 1e3).toFixed(2)} µs`;
  return `${ns.toFixed(2)} ns`;
}

export function deltaEmoji(pct) {
  const abs = Math.abs(pct);
  if (abs < 2) return '⚪';
  if (pct <= -5) return '🟢';
  if (pct >= 5) return '🔴';
  if (pct < 0) return '🟢';
  return '🟠';
}

/**
 * Parse benchmark JSON results into control/experiment pairs with deltas.
 * Uses p50 (median) which is more robust to outliers than avg.
 */
export function parsePairs(json) {
  const pairs = new Map();

  for (const trial of json.benchmarks || []) {
    for (const r of trial.runs || []) {
      if (!r.stats) continue;
      const m = r.name.match(/^(.+)\s+\((control|experiment)\)$/);
      if (!m) continue;
      const [, key, role] = m;
      if (!pairs.has(key)) pairs.set(key, {});
      pairs.get(key)[role] = r.stats;
    }
  }

  const rows = [];
  for (const [name, { control, experiment }] of pairs) {
    if (!control || !experiment) continue;
    const ctrlVal = control.p50 ?? control.avg;
    const expVal = experiment.p50 ?? experiment.avg;
    const delta = ((expVal - ctrlVal) / ctrlVal) * 100;
    rows.push({ name, control: ctrlVal, experiment: expVal, delta });
  }

  return rows;
}

/**
 * Read and parse the benchmark JSON results file.
 */
export function readBenchJSON(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
