'use strict';
/* eslint filenames/match-regex:"off" */

const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const eslintPluginEslintPluginAll = require('eslint-plugin-eslint-plugin/configs/all');
const eslintPluginFilenames = require('eslint-plugin-filenames');
const eslintPluginJest = require('eslint-plugin-jest');
const eslintPluginMarkdown = require('eslint-plugin-markdown');
const eslintPluginN = require('eslint-plugin-n');
const babelEslintParser = require('@babel/eslint-parser');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // Legacy configs:
  ...compat.extends(
    'plugin:eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended'
  ),

  eslintPluginEslintPluginAll,

  eslintPluginN.configs['flat/recommended'],

  {
    ignores: [
      'coverage/',
      'node_modules/',
      'lib/recommended-rules.js',
      'lib/recommended-rules-gjs.js',
      'lib/recommended-rules-gts.js',
      'tests/__snapshots__/',

      // # Contains <template> in js markdown
      'docs/rules/no-empty-glimmer-component-classes.md',
      'docs/rules/template-no-let-reference.md',
    ],
  },
  {
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'script',
        babelOptions: {
          configFile: require.resolve('./.babelrc'),
        },
      },
    },
    plugins: { filenames: eslintPluginFilenames },
    rules: {
      // Optional eslint rules:
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'consistent-return': 'error',
      'default-case': 'error',
      'default-case-last': 'error',
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
      'no-useless-backreference': 'error',
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
      'require-atomic-updates': 'error',
      'require-await': 'error',
      'spaced-comment': ['error', 'always', { exceptions: ['-'] }],
      'wrap-iife': 'error',
      complexity: 'error',
      curly: 'error',
      eqeqeq: 'error',
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }], // Disallow unnecessary template literals.
      radix: 'error',
      yoda: 'error',
      // eslint-comments rules:
      'eslint-comments/no-unused-disable': 'error',

      // eslint-plugin rules:
      'eslint-plugin/consistent-output': ['error', 'always'],
      'eslint-plugin/prefer-message-ids': 'off',
      'eslint-plugin/require-meta-docs-url': [
        'error',
        {
          pattern:
            'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/{{name}}.md',
        },
      ],

      // Filenames:
      'filenames/match-regex': ['error', '^.?[a-z0-9-]+$'], // Kebab-case.

      // Optional import rules:
      'import/extensions': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-deprecated': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-unassigned-import': 'error',
      'import/no-unused-modules': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/unambiguous': 'error',

      // Unicorn rules:
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-lonely-if': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-node-protocol': 'off', // Enable once we drop support for Node 14.0.0.
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    // Test files:
    files: ['**/*.js', '**/*.js.snap'],
    plugins: { jest: eslintPluginJest },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
      ...eslintPluginJest.configs.style.rules,

      // Optional jest rules:
      'jest/consistent-test-it': 'error',
      'jest/no-duplicate-hooks': 'error',
      'jest/no-hooks': 'error',
      'jest/no-if': 'error',
      'jest/no-large-snapshots': 'error',
      'jest/no-restricted-matchers': 'error',
      'jest/no-test-return-statement': 'error',
      'jest/prefer-called-with': 'error',
      'jest/prefer-hooks-on-top': 'error',
      'jest/prefer-lowercase-title': 'error',
      'jest/prefer-spy-on': 'error',
      'jest/prefer-strict-equal': 'error',
      'jest/prefer-todo': 'error',
      'jest/require-to-throw-message': 'error',
      'jest/require-top-level-describe': 'error',
      'jest/valid-title': 'error',
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.md'],
    plugins: { markdown: eslintPluginMarkdown },
    processor: 'markdown/markdown',
  },
  {
    // Markdown code samples in documentation:
    files: ['**/*.md/*.js'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
    rules: {
      // Ignore violations that generally don't matter inside code samples.
      'filenames/match-regex': 'off',
      'import/no-unresolved': 'off',
      'import/unambiguous': 'off',
      'jest/expect-expect': 'off',
      'jest/no-done-callback': 'off',
      'jest/no-test-callback': 'off',
      'jest/require-top-level-describe': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-unused-labels': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      'prettier/prettier': ['error', { trailingComma: 'none' }],
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/filename-case': 'off',
    },
  },
];
