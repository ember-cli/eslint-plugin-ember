'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  plugins: [
    'eslint-plugin',
    'import',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/all',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier'
  ],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    // Optional eslint rules:
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    complexity: 'error',
    'consistent-return': 'error',
    curly: 'error',
    'default-case': 'error',
    eqeqeq: 'error',
    'new-parens': 'error',
    'no-async-promise-executor': 'error',
    'no-console': 'error',
    'no-duplicate-imports': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-implied-eval': 'error',
    'no-lone-blocks': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': ['error', { props: true }],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-use-before-define': ['error', 'nofunc'],
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'spaced-comment': ['error', 'always', { exceptions: ['-'] }],
    'wrap-iife': 'error',
    yoda: 'error',

    // Prettier:
    'prettier/prettier': 'error',

    // eslint-plugin rules:
    'eslint-plugin/no-deprecated-report-api': 'off',
    'eslint-plugin/require-meta-type': 'off',
    'eslint-plugin/require-meta-docs-url': 'off',
    'eslint-plugin/test-case-property-ordering': 'off',
  },
  overrides: [
    // test files
    {
      files: ['tests/**/*.js',],
      env: { jest: true },
    },
  ],
};
