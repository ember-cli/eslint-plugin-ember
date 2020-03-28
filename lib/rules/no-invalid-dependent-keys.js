'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule -  Dependent keys used for computed properties have to be valid.
//------------------------------------------------------------------------------

const ERROR_MESSAGE_UNBALANCED_BRACES = 'Found unbalanced braces in dependent key';
const ERROR_MESSAGE_TERMINAL_AT_EACH = 'Found terminal `@each`, use `[]` instead';
const ERROR_MESSAGE_MIDDLE_BRACKETS = '`[]` should only be used at the end of the dependent key';

function hasUnbalancedBraces(str) {
  const foundBraces = str.match(/[{}]/g) || [];
  const openBraces = foundBraces.filter((c) => c === '{').length;
  const closeBraces = foundBraces.filter((c) => c === '}').length;
  return openBraces !== closeBraces;
}

function hasTerminalAtEach(str) {
  return str.endsWith('.@each');
}

function hasMiddleBrackets(str) {
  return str.includes('[].');
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid dependent keys in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-invalid-dependent-keys.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE_UNBALANCED_BRACES,
  ERROR_MESSAGE_TERMINAL_AT_EACH,
  ERROR_MESSAGE_MIDDLE_BRACKETS,

  create(context) {
    return {
      CallExpression(node) {
        if (!ember.isComputedProp(node) || types.isMemberExpression(node.callee)) {
          return;
        }

        const stringArgs = node.arguments.filter(
          (arg) => types.isLiteral(arg) && typeof arg.value === 'string'
        );

        const sourceCode = context.getSourceCode();

        stringArgs.forEach((node) => {
          if (hasTerminalAtEach(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_TERMINAL_AT_EACH,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace('.@each', '.[]'));
              },
            });
          }

          if (hasUnbalancedBraces(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_UNBALANCED_BRACES,
            });
          }

          if (hasMiddleBrackets(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_MIDDLE_BRACKETS,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace('[].', '@each.'));
              },
            });
          }
        });
      },
    };
  },
};
