/**
 * @fileoverview help users writing tests in Ember using @ember/test-helpers check their imports to ensure they are using the correct method rather than the native method on window
 * @author Connie Chang
 */
'use strict';

const { getImportIdentifier } = require('../utils/import');

let hasImportedBlur = undefined;
let hasImportedFind = undefined;
let hasImportedFocus = undefined;

//-------------------------------------------------------------------------------------
// Rule Definition
// See proposal on Github: https://github.com/ember-cli/eslint-plugin-ember/issues/676
//-------------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce import of @ember/test-helpers method to ensure native method on `window` is not incorrectly used',
      category: 'Testing',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/prefer-ember-test-helpers.md',
    },
    schema: [],
  },

  create: context => {
    const showErrorMessage = function(node, methodName) {
      let errorMessage = 'Import the correct method from Ember test-helpers';

      switch (methodName) {
        case 'blur':
          errorMessage = 'Import the `blur()` method from Ember test-helpers';
          break;
        case 'find':
          errorMessage = 'Import the `find()` method from Ember test-helpers';
          break;
        case 'focus':
          errorMessage = 'Import the `focus()` method from Ember test-helpers';
          break;
        default:
      }

      context.report({
        message: errorMessage,
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
