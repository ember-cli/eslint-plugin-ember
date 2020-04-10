'use strict';

const { getImportIdentifier } = require('../utils/import');

//-------------------------------------------------------------------------------------
// Rule Definition
//-------------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce import of @ember/test-helpers method to ensure native method on `window` is not incorrectly used',
      category: 'Testing',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/prefer-ember-test-helpers.md',
    },
    schema: [],
  },

  create: (context) => {
    let hasImportedBlur = undefined;
    let hasImportedFind = undefined;
    let hasImportedFocus = undefined;

    const showErrorMessage = (node, methodName) => {
      context.report({
        data: { methodName },
        message: 'Import the `{{methodName}}()` method from @ember/test-helpers',
        node,
      });
    };

    return {
      ImportDeclaration(node) {
        hasImportedBlur = getImportIdentifier(node, '@ember/test-helpers', 'blur');
        hasImportedFind = getImportIdentifier(node, '@ember/test-helpers', 'find');
        hasImportedFocus = getImportIdentifier(node, '@ember/test-helpers', 'focus');
      },
      CallExpression(node) {
        if (!hasImportedBlur) {
          if (node.parent && node.parent.type === 'AwaitExpression') {
            if (node.callee.name === 'blur') {
              showErrorMessage(node, 'blur');
            }
          }
        }

        if (!hasImportedFind) {
          if (node.parent && node.parent.type === 'AwaitExpression') {
            if (node.callee.name === 'find') {
              showErrorMessage(node, 'find');
            }
          }
        }

        if (!hasImportedFocus) {
          if (node.parent && node.parent.type === 'AwaitExpression') {
            if (node.callee.name === 'focus') {
              showErrorMessage(node, 'focus');
            }
          }
        }
      },
    };
  },
};
