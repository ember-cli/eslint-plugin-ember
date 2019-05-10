'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Ember\'s `getProperties` function can be omitted in a destructuring assignment.';

module.exports = {
  meta: {
    docs: {
      description: 'Disallow unnecessary usage of Ember\'s `getProperties` function',
      category: 'Best Practices',
      recommended: false
    },
    ERROR_MESSAGE
  },

  create(context) {
    return {
      CallExpression(node) {
        if (
          utils.isMemberExpression(node.callee) &&
          utils.isThisExpression(node.callee.object) &&
          utils.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getProperties' &&
          validateGetPropertiesArguments(node.arguments)
        ) {
          // Example: this.getProperties('abc', 'def');
          context.report(node, ERROR_MESSAGE);
        }

        if (
          utils.isIdentifier(node.callee) &&
          node.callee.name === 'getProperties' &&
          node.arguments.length >= 1 &&
          utils.isThisExpression(node.arguments[0]) &&
          validateGetPropertiesArguments(node.arguments.slice(1))
        ) {
          // Example: getProperties(this, 'abc', 'def');
          context.report(node, ERROR_MESSAGE);
        }
      }
    };
  }
};

function validateGetPropertiesArguments(args) {
  if (args.length === 1 && utils.isArrayExpression(args[0])) {
    return validateGetPropertiesArguments(args[0].elements);
  }
  // We can only handle string arguments without nested property paths.
  return args.every(argument => utils.isStringLiteral(argument) && !argument.value.includes('.'));
}
