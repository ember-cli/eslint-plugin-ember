'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

const ERROR_MESSAGE = 'Do not use arrow functions in computed properties';

module.exports = {
  ERROR_MESSAGE,

  meta: {
    docs: {
      description: 'Disallows arrow functions in computed properties',
      category: 'Possible Errors',
      recommended: true,
    },
  },

  create(context) {
    let isThisPresent = false;

    return {
      ThisExpression() {
        isThisPresent = true;
      },
      CallExpression() {
        isThisPresent = false;
      },
      'CallExpression:exit'(node) {
        const isComputedArrow =
          emberUtils.isComputedProp(node) &&
          node.arguments.length > 0 &&
          types.isArrowFunctionExpression(node.arguments[node.arguments.length - 1]);

        const isLintApplicable = isComputedArrow && isThisPresent;

        if (isLintApplicable) {
          context.report(node.arguments[node.arguments.length - 1], ERROR_MESSAGE);
        }
      },
    };
  },
};
