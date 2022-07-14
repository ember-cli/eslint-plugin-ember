/**
 * @fileOverview no importing of test files and no exporting in test files
 */

'use strict';

const path = require('path');
const emberUtils = require('../utils/ember');

const NO_IMPORT_MESSAGE =
  'Do not import from a test file (a file ending in "-test.js") in another test file. Doing so will cause the module and tests from the imported file to be executed again.';

const NO_EXPORT_MESSAGE = 'No exports from test file. Any exports should be done in a test helper.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing of "-test.js" in a test file and exporting from a test file',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-import-export.md',
    },
    schema: [],
    importMessage: NO_IMPORT_MESSAGE,
    exportMessage: NO_EXPORT_MESSAGE,
  },

  create: function create(context) {
    const noExports = function (node) {
      if (
        !emberUtils.isTestFile(context.getFilename()) ||
        isTestHelperFilename(context.getFilename())
      ) {
        return;
      }

      context.report({
        message: NO_EXPORT_MESSAGE,
        node,
      });
    };

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (
          importSource.endsWith('-test') &&
          !isTestHelperFilename(path.resolve(path.dirname(context.getFilename()), importSource))
        ) {
          context.report({
            message: NO_IMPORT_MESSAGE,
            node,
          });
        }
      },
      ExportNamedDeclaration(node) {
        noExports(node);
      },
      ExportDefaultDeclaration(node) {
        noExports(node);
      },
    };
  },
};

function isTestHelperFilename(filename) {
  const filenameParts = path.normalize(filename).split(path.sep);
  for (let i = 0; i < filenameParts.length - 1; ++i) {
    if (filenameParts[i] === 'tests' && filenameParts[i + 1] === 'helpers') {
      return true;
    }
  }
  return false;
}
