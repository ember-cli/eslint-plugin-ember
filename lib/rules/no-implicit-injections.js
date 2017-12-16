'use strict';

const ember = require('../utils/ember');

const MESSAGE = 'Do not use implicit service/controller injections';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of implicit injections',
      category: 'Best Practices',
      recommended: true
    },
    fixable: 'code',  // null or "code" or "whitespace"
    message: MESSAGE
  },

  create(context) {
    const fix = () => {
      // Implement
    };

    return {
      CallExpression(node) {
        const isInjectedServiceProp = ember.isInjectedServiceProp(node);
        const isInjectedControllerProp = ember.isInjectedControllerProp(node);
        const isInjection = isInjectedControllerProp || isInjectedServiceProp;

        if (isInjection && node.arguments.length === 0) {
          context.report({ node, message: MESSAGE, fix });
        }
      }
    };
  }
};
