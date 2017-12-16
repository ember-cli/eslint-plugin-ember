'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

const ALIASES = ['$', 'jQuery'];
const MESSAGE = 'Do not use implicit service/controller injections';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of implicit injections',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',  // null or "code" or "whitespace"
    message: MESSAGE,
  },

  create(context) {
    let emberImportAliasName;
    let destructuredAssignment;
    let fix = (fixer) => {
      debugger;
    };

    return {
      CallExpression(node) {
        let isInjectedServiceProp = ember.isInjectedServiceProp(node);
        let isInjectedControllerProp = ember.isInjectedControllerProp(node);
        let isInjection = isInjectedControllerProp || isInjectedServiceProp;

        if (isInjection && node.arguments.length === 0) {
          context.report({ node, message: MESSAGE, fix });
        }
      }
    };
  }
};