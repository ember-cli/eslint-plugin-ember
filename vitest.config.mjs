import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [],
    include: ['**/tests/**/*.js'],
    exclude: ['tests/helpers/**', 'tests/bench/**', 'tests/fixtures/**', 'node_modules'],
    // Each test file runs isolated, so the first RuleTester case per file
    // re-pays ~1-1.5s of parser initialization (content-tag wasm, TS
    // machinery). On a loaded machine that first case can blow the default
    // 5s timeout, failing a random valid case per run.
    testTimeout: 30_000,
    sequence: {
      hooks: 'list',
    },
    coverage: {
      branches: 95,
      functions: 98.95,
      lines: 98,
      statements: 98,
    },
  },
});
