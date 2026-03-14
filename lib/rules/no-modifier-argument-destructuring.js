'use strict';

const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE =
  'Do not destructure the positional or named arguments of a modifier. Instead, access them by index or property to avoid eagerly consuming tracked data.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow destructuring of modifier arguments to avoid consuming tracked data too early',
      category: 'Ember Object',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-modifier-argument-destructuring.md',
    },
    fixable: null,
    schema: [],
    messages: {
      main: ERROR_MESSAGE,
    },
  },

  ERROR_MESSAGE,

  create(context) {
    let modifierImportedName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember-modifier') {
          modifierImportedName ??= getImportIdentifier(
            node,
            'ember-modifier',
            'modifier',
          );
        }
      },

      CallExpression(node) {
        if (!modifierImportedName) {
          return;
        }

        if (
          node.callee.type !== 'Identifier' ||
          node.callee.name !== modifierImportedName
        ) {
          return;
        }

        const callback = node.arguments[0];
        if (!callback) {
          return;
        }

        // Support arrow functions and function expressions
        if (
          callback.type !== 'ArrowFunctionExpression' &&
          callback.type !== 'FunctionExpression'
        ) {
          return;
        }

        // Check 2nd parameter (positional args) - index 1
        const positionalParam = callback.params[1];
        if (positionalParam && positionalParam.type === 'ArrayPattern') {
          context.report({
            node: positionalParam,
            messageId: 'main',
          });
        }

        // Check 3rd parameter (named args) - index 2
        const namedParam = callback.params[2];
        if (namedParam && namedParam.type === 'ObjectPattern') {
          context.report({
            node: namedParam,
            messageId: 'main',
          });
        }
      },
    };
  },
};
