'use strict';

const utils = require('../utils/utils');
const emberUtils = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Usage of Ember's `assert` / `warn` / `deprecate` function has its arguments passed in the wrong order. `String description` should come before `Boolean condition`.";
const DEBUG_FUNCTIONS = ['assert', 'deprecate', 'warn'];

module.exports = {
  meta: {
    docs: {
      description: "Catch usages of Ember's `assert()` / `warn()` / `deprecate()` functions that have the arguments passed in the wrong order.",
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null
  },

  ERROR_MESSAGE,
  DEBUG_FUNCTIONS,

  create(context) {
    return {
      CallExpression(node) {
        if (isDebugFunctionWithReversedArgs(node)) {
          context.report({
            node,
            message: ERROR_MESSAGE
          });
        }
      }
    };
  }
};

function isDebugFunctionWithReversedArgs(node) {
  return (
    isDebugFunction(node) &&
    node.arguments.length >= 2 &&
    !isString(node.arguments[0]) &&
    isString(node.arguments[1])
  );
}

function isDebugFunction(node) {
  // Example: Detects `Ember.assert()` or `assert()`.
  return DEBUG_FUNCTIONS.some(debugFunction => emberUtils.isModule(node, debugFunction));
}

function isString(node) {
  return utils.isTemplateLiteral(node) || (utils.isLiteral(node) && typeof node.value === 'string');
}
