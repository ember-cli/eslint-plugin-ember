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
    /**
     * We don't want to *always* have the preprocessor active,
     * it's only relevant on gjs and gts files.
     *
     * Additionally, we need to declare a global (which is private API)
     * so that ESLint doesn't report errors about the variable being undefined.
     * While this is true, it's a temporary thing for babel to do further processing
     * on -- and isn't relevant to user-land code.
     */
    {
      files: ['**/*.gjs', '**/*.gts'],
      processor: 'ember/<template>',
      globals: {
        [util.TEMPLATE_TAG_PLACEHOLDER]: 'readonly',
      },
    },
  ],
};
