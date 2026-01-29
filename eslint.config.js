'use strict';
/* eslint filenames/match-regex:"off" */

const js = require('@eslint/js');
const babelEslintParser = require('@babel/eslint-parser');
const eslintPluginEslintPluginAll = require('eslint-plugin-eslint-plugin/configs/all');
const eslintPluginFilenames = require('eslint-plugin-filenames');
const eslintPluginMarkdown = require('eslint-plugin-markdown');
const eslintPluginN = require('eslint-plugin-n');

const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');
const { FlatCompat } = require('@eslint/eslintrc');
const { includeIgnoreFile } = require('@eslint/compat');
const path = require('node:path');

const gitignorePath = path.resolve(__dirname, '.gitignore');

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
    'prettier'
  ),

  // Flat configs:
  eslintPluginEslintPluginAll,
  eslintPluginN.configs['flat/recommended'],
  eslintPluginUnicorn.configs['flat/recommended'],
  eslintConfigPrettier,

  {
    languageOptions: {
      parser: babelEslintParser,
      sourceType: 'script',
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

      'n/no-unsupported-features/node-builtins': 'off',

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
    plugins: {},
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
      sourceType: 'module',
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
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/filename-case': 'off',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 2022,
        babelOptions: {
          configFile: require.resolve('./.babelrc'),
        },
      },
    },
    rules: {
      // Extensions are required in ESM
      'import/extensions': ['error', 'ignorePackages'],
      // These don't appear to work correctly
      // All these throw on the import of a dependency
      'import/namespace': 'off',
      'import/no-deprecated': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresalved': 'off',
      'import/no-missing-import': 'off',

      // vite config format does not match regex
      'filenames/match-regex': 'off',
    },
  },
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
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
];
