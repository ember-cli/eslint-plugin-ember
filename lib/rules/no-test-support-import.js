/**
 * @fileOverview no importing of test files and no exporting in test files
 */

'use strict';

const path = require('path');

const ERROR_MESSAGE_NO_IMPORT =
  'Do not import a file from test-support into production code, only into test files.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE_NO_IMPORT,

  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing of "test-support" files in production code.',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-support-import.md',
    },
    schema: [],
  },

  create: function create(context) {
    const fileName = context.getFilename();
    const fileNameParts = path.normalize(fileName).split(path.sep);

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;
        const importSourceParts = path.normalize(importSource).split(path.sep);

        if (
          importSourceParts.includes('test-support') &&
          !(
            fileNameParts.includes('tests') ||
            fileNameParts.includes('addon-test-support') ||
            fileNameParts.includes('test-support')
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
