const plugin = require('../index');
const emberEslintParser = require('ember-eslint-parser');
const { getEmber71BuiltInKeywords } = require('../utils/ember71-built-in-keywords');

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
      globals: {
        ...getEmber71BuiltInKeywords(),
      },
    },
    processor: 'ember/noop',
  },
];
