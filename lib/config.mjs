import plugin from './index.js';
import gjsRules from './recommended-rules-gjs.js';
import gtsRules from './recommended-rules-gts.js';
import parser from 'ember-eslint-parser';

export const base = {
  plugins: { ember: plugin },
};

export const gjs = {
  plugins: { ember: plugin },
  files: ['**/*.gjs'],
  languageOptions: {
    parser,
  },
  processor: 'ember/noop',
  rules: gjsRules,
};

export const gts = {
  plugins: { ember: plugin },
  files: ['**/*.gts'],
  languageOptions: {
    parser,
  },
  processor: 'ember/noop',
  rules: gtsRules,
};
