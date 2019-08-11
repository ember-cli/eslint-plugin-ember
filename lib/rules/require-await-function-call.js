'use strict';

const utils = require('../utils/utils');
const ASYNC_EMBER_TEST_HELPERS = require('../utils/async-ember-test-helpers');

/**
 * Checks if the given node is part of a call with the `await` keyword.
 *
 * @param {ASTNode} node - the node to check.
 * @returns {boolean} `true` if the node is part of a call with the `await` keyword.
 */
function isAwaitCall(node) {
  if (!node.parent) {
    // Can't be part of an AwaitExpression if it has no parent.
    return false;
  }

  const parent = node.parent;

  if (utils.isAwaitExpression(parent)) {
    return true;
  }

  if (utils.isCallExpression(parent) || utils.isMemberExpression(parent)) {
    // Check to see if the AwaitExpression is still another level above.
    return isAwaitCall(parent);
  }

  return false;
}

module.exports = {
  meta: {
    docs: {
      description:
        'Enforces using `await` with calls to the specified functions (defaults to the async Ember test helpers like `click` and `visit`).',
      category: 'Testing',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          functions: {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      CallExpression(node) {
        const functions = context.options[0]
          ? context.options[0].functions
          : ASYNC_EMBER_TEST_HELPERS;

        const callee = node.callee;
        if (!utils.isIdentifier(callee) || !functions.includes(callee.name)) {
          // Not one of the specified async functions.
          return;
        }

        if (!isAwaitCall(node)) {
          // Missing `await`.
          context.report({
            node,
            message: 'Use `await` with `{{ calleeName }}` function call.',
            data: {
              calleeName: node.callee.name,
            },
            fix(fixer) {
              // TODO: an improvement would be to add the `async` keyword to containing function if necessary.
              return fixer.insertTextBefore(node, 'await ');
            },
          });
        }
      },
    };
  },
};
