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

  overrides: [
    /**
     * We don't want to *always* have the preprocessor active,
     * it's only relevant on gjs and gts files to detect if eslint config is correctly setup for this files.
     */
    {
      files: ['**/*.{gts,gjs}'],
      parser: 'eslint-plugin-ember/gjs-gts-parser',
      processor: 'ember/<noop>',
    },
  ],
};
