import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [],
    include: ['**/tests/**/*.js'],
    exclude: ['tests/helpers/**', 'node_modules'],
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
