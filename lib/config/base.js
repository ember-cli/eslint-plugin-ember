const plugin = require('../index');
const emberEslintParser = require('ember-eslint-parser');

module.exports = [
  {
    name: 'ember:plugin',
    plugins: { ember: plugin },
  },

  /**
   * We don't want to *always* have the preprocessor active,
   * it's only relevant on gjs and gts files to detect if eslint config is correctly setup for this files.
   */
  {
    name: 'ember:parser',
    files: ['**/*.{gts,gjs}'],
    languageOptions: {
      parser: emberEslintParser,
    },
    processor: 'ember/noop',
  },
];
