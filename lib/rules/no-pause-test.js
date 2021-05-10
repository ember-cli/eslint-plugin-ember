'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Do not use `pauseTest()`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of the `pauseTest` helper in tests',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-pause-test.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    let importedPauseTestName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/test-helpers') {
          importedPauseTestName =
            importedPauseTestName || getImportIdentifier(node, '@ember/test-helpers', 'pauseTest');
        }
      },

      CallExpression(node) {
        const { callee } = node;

        if (
          (types.isIdentifier(callee) && callee.name === importedPauseTestName) ||
          (types.isThisExpression(callee.object) &&
            types.isIdentifier(callee.property) &&
            callee.property.name === 'pauseTest')
        ) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
