const plugin = require('../index');

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
    parser: 'ember-eslint-parser',
  },
];
