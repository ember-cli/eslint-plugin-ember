import emberPlugin from './index.js';
import baseRules from './recommended-rules.js';
import gjsRules from './recommended-rules-gjs.js';
import gtsRules from './recommended-rules-gts.js';
import emberParser from 'ember-eslint-parser';

export const plugin = emberPlugin;
export const parser = emberParser;

export const base = {
  files: ['**/*.{js,ts}'],
  plugins: { ember: emberPlugin },
  rules: {
    ...baseRules,
  },
};

export const gjs = {
  plugins: { ember: emberPlugin },
  files: ['**/*.gjs'],
  languageOptions: {
    parser: emberParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: 'latest',
      // babel config options should be supplied in the consuming project
    },
  },
  processor: 'ember/noop',
  rules: {
    ...base.rules,
    ...gjsRules,
  },
};

export const gts = {
  plugins: { ember: emberPlugin },
  files: ['**/*.gts'],
  languageOptions: {
    parser: emberParser,
    parserOptions: {
      extraFileExtensions: ['.gts'],
    },
    // parser options should be supplied in the consuming project
  },
  processor: 'ember/noop',
  rules: {
    ...base.rules,
    ...gtsRules,
  },
};

export default {
  // Helpful utility exports
  plugin,
  parser,
  // Recommended config sets
  configs: {
    base,
    gjs,
    gts,
  },
};
