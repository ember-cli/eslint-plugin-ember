const plugin = require('../index');
const emberEslintParser = require('ember-eslint-parser');
const emberEslintParserHbs = require('ember-eslint-parser/hbs'); // eslint-disable-line import/no-unresolved

module.exports = [
  {
    plugins: { ember: plugin },
  },

  /**
   * We don't want to *always* have the preprocessor active,
   * it's only relevant on gjs and gts files to detect if eslint config is correctly setup for this files.
   */
  {
    files: ['**/*.{gts,gjs}'],
    languageOptions: {
      parser: emberEslintParser,
    },
    processor: 'ember/noop',
  },
  {
    files: ['**/*.hbs'],
    languageOptions: {
      parser: emberEslintParserHbs,
    },
    processor: 'ember/template-lint-disable',
  },
];
