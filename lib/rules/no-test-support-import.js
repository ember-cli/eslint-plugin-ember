/**
 * @fileOverview no importing of test files and no exporting in test files
 */

'use strict';

const NO_IMPORT_MESSAGE =
  'Do not import a file from test-support into production code, only into files located in test.';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing of "test-support" files in production code.',
      category: 'Testing',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-support-import.md',
    },
    schema: [],
    importMessage: NO_IMPORT_MESSAGE,
  },

  create: function create(context) {
    const fileName = context.getFilename();

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (
          importSource.includes('test-support') &&
          !(fileName.includes('/tests/') || fileName.includes('/addon-test-support/'))
        ) {
          context.report({
            message: NO_IMPORT_MESSAGE,
            node,
          });
        }
      },
    };
  },
};
