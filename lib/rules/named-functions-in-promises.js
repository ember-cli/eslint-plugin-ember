'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule - Use named functions defined on objects to handle promises
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {}
  },

  create(context) {
    const message = 'Use named functions defined on objects to handle promises';

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        const firstArg = node.arguments[0];

        if (
          hasPromiseExpression(node) &&
          (
            utils.isFunctionExpression(firstArg) ||
            utils.isArrowFunctionExpression(firstArg)
          )
        ) {
          report(node);
        }
      },
    };

    function hasPromiseExpression(node) {
      const callee = node.callee;
      const promisesMethods = ['then', 'catch', 'finally'];

      return utils.isCallExpression(callee.object) &&
        utils.isIdentifier(callee.property) &&
        promisesMethods.indexOf(callee.property.name) > -1;
    }
  }
};
