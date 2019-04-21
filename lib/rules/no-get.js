'use strict';

const utils = require('../utils/utils');

function makeErrorMessage(property, isImportedGet) {
  return isImportedGet
    ? `Use \`this.${property}\` instead of \`get(this, '${property}')\``
    : `Use \`this.${property}\` instead of \`this.get('${property}')\``;
}

module.exports = {
  makeErrorMessage,
  meta: {
    docs: {
      description: "Disallow unnecessary usage of Ember's `get` function",
      category: 'Best Practices',
      recommended: false
    }
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          utils.isMemberExpression(node.callee) &&
          utils.isThisExpression(node.callee.object) &&
          node.callee.property.name === 'get' &&
          node.arguments.length === 1 &&
          utils.isStringLiteral(node.arguments[0]) &&
          !node.arguments[0].value.includes('.')
        ) {
          // Example: this.get('foo');
          context.report(node, makeErrorMessage(node.arguments[0].value), false);
        }

        if (
          utils.isIdentifier(node.callee) &&
          node.callee.name === 'get' &&
          node.arguments.length === 2 &&
          utils.isThisExpression(node.arguments[0]) &&
          utils.isStringLiteral(node.arguments[1]) &&
          !node.arguments[1].value.includes('.')
        ) {
          // Example: get(this, 'foo');
          context.report(node, makeErrorMessage(node.arguments[1].value, true));
        }
      }
    };
  }
};
