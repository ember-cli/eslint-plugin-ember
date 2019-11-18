'use strict';

const types = require('../utils/types');

function makeErrorMessageForGetWithDefault(property, isImportedGetWithDefault) {
  return isImportedGetWithDefault
    ? `Use \`this.${property}\` instead of \`getWithDefault(this, '${property}', ...)\``
    : `Use \`this.${property}\` instead of \`this.getWithDefault('${property}', ...)\``;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use the `||` operator instead of `getWithDefault` for more expected behaviors',
      category: 'Best Practices',
      recommended: false,
      octane: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-get-with-default.md',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getWithDefault' &&
          node.arguments.length === 2
        ) {
          // Example: this.getWithDefault('foo', 'bar');
          context.report(node, makeErrorMessageForGetWithDefault(node.arguments[0].value, false));
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === 'getWithDefault' &&
          node.arguments.length === 3 &&
          types.isThisExpression(node.arguments[0])
        ) {
          // Example: getWithDefault(this, 'foo', 'bar');
          context.report(node, makeErrorMessageForGetWithDefault(node.arguments[1].value, true));
        }
      },
    };
  },
};
