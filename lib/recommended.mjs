import emberPlugin from './index.js';
import gjsRules from './recommended-rules-gjs.js';
import gtsRules from './recommended-rules-gts.js';
import emberParser from 'ember-eslint-parser';

export const plugin = emberPlugin;
export const parser = emberParser;

export const base = {
  plugins: { ember: emberPlugin },
};

export const gjs = {
  plugins: { ember: emberPlugin },
  files: ['**/*.gjs'],
  languageOptions: {
    parser: emberParser,
  },
  processor: 'ember/noop',
  rules: gjsRules,
};

export const gts = {
  plugins: { ember: emberPlugin },
  files: ['**/*.gts'],
  languageOptions: {
    parser: emberParser,
  },
  processor: 'ember/noop',
  rules: gtsRules,
};

export default {
  // Helpful utility exports
  plugin,
  parser,
  // Recommended config sets
  base,
  gjs,
  gts,
};
