// / <reference types="vitest" />
// / <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['tests/acceptance/*/*.test.{js,mjs,ts,mts}'],
    exclude: ['**/node_modules/**'],
  },
});
