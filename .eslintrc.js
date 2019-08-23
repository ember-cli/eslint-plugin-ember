'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  plugins: ['import', 'prettier'],
  extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/warnings', 'prettier'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    // Possible Errors
    // 'no-async-promise-executor': 'error',  // available in ESLint 5
    'no-template-curly-in-string': 'error',
    // 'require-atomic-updates': 'error',  // available in ESLint 5

    // Best Practices
    'array-callback-return': 'error',
    eqeqeq: 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-implied-eval': 'error',
    'no-lone-blocks': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-return-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    // 'no-useless-catch': 'error',  // available in ESLint 5
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    radix: 'error',
    'wrap-iife': 'error',
    yoda: 'error',

    // ECMAScript 6
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-numeric-literals': 'error',

    'prettier/prettier': 'error',
  },
  overrides: [
    // test files
    {
      files: ['tests/**/*.js',],
      env: { jest: true },
    },
  ],
};
