const rules = require('../recommended-rules');
const util = require('ember-template-imports/src/util');

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  env: {
    browser: true,
    es2020: true,
  },

  plugins: ['ember'],

  rules,

  overrides: [
    {
      files: ['**/*.gjs', '**/*.gts'],
      processor: 'ember/<template>',
      globals: {
        [util.TEMPLATE_TAG_PLACEHOLDER]: 'readonly',
      },
    },
  ],
};
