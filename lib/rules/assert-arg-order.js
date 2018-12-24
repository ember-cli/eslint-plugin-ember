'use strict';

const utils = require('../utils/utils');
const emberUtils = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Usage of Ember's assert(String description, Boolean condition) function has its arguments passed in the wrong order.";

module.exports = {
  meta: {
    docs: {
      description: "Catch usages of Ember's `assert()` function that have the arguments passed in the wrong order.",
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null,
    ERROR_MESSAGE
  },

  create(context) {
    return {
      CallExpression(node) {
        if (isAssertFunctionWithReversedArgs(node)) {
          context.report({
            node,
            message: ERROR_MESSAGE
          });
        }
      }
    };
  }
};

function isAssertFunctionWithReversedArgs(node) {
  return (
    isAssertFunction(node) &&
    node.arguments.length === 2 &&
    !isString(node.arguments[0]) &&
    isString(node.arguments[1])
  );
}

function isAssertFunction(node) {
  // Detect `Ember.assert()` or `assert()`.
  return emberUtils.isModule(node, 'assert');
}

function isString(node) {
  return utils.isTemplateLiteral(node) || (utils.isLiteral(node) && typeof node.value === 'string');
}
