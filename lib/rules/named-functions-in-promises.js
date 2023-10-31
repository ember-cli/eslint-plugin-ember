'use strict';

const types = require('../utils/types');

//------------------------------------------------------------------------------
// General rule - Use named functions defined on objects to handle promises
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of named functions in promises',
      category: 'Miscellaneous',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/named-functions-in-promises.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowSimpleArrowFunction: {
            type: 'boolean',
            default: false,
            description:
              'Enabling allows arrow function expressions that do not have block bodies. These simple arrow functions must also only contain a single function call. For example: `.then(user => this._reloadUser(user))`.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowSimpleArrowFunction = options.allowSimpleArrowFunction || false;

    const message = 'Use named functions defined on objects to handle promises';

    const report = function (node) {
      context.report({ node, message });
    };

    return {
      CallExpression(node) {
        const firstArg = node.arguments[0];

        if (hasPromiseExpression(node)) {
          if (
            allowSimpleArrowFunction &&
            types.isConciseArrowFunctionWithCallExpression(firstArg)
          ) {
            return;
          }
          if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
            report(node);
          }
        }
      },
    };
  },
};

function hasPromiseExpression(node) {
  const callee = node.callee;
  const promisesMethods = new Set(['then', 'catch', 'finally']);

  return (
    types.isCallExpression(callee.object) &&
    types.isIdentifier(callee.property) &&
    promisesMethods.has(callee.property.name)
  );
}
