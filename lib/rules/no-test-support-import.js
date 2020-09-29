/**
 * @fileOverview no importing of test files and no exporting in test files
 */

'use strict';

const ERROR_MESSAGE_NO_IMPORT =
  'Do not import a file from test-support into production code, only into test files.';

function hasTestSupportDirectory(importSource) {
  return (
    importSource.startsWith('test-support/') ||
    importSource.endsWith('/test-support') ||
    importSource.includes('/test-support/')
  );
}

module.exports = {
  ERROR_MESSAGE_NO_IMPORT,

  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing of "test-support" files in production code.',
      category: 'Testing',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-support-import.md',
    },
    schema: [],
  },

  create: function create(context) {
    const fileName = context.getFilename();

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (
          hasTestSupportDirectory(importSource) &&
          !(
            fileName.includes('/tests/') ||
            fileName.includes('/addon-test-support/') ||
            fileName.includes('/test-support/')
          )
        ) {
          context.report({
            message: ERROR_MESSAGE_NO_IMPORT,
            node,
          });
        }
      },
    };
  },
};
