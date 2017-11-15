'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Warns about unexpected side effects in computed properties',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Don\'t introduce side-effects in computed properties';

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        const callee = node.callee;
        const fnNodes = utils.findNodes(node.arguments, 'FunctionExpression');

        if (callee && callee.name === 'computed' && fnNodes) {
          fnNodes.forEach((fnNode) => {
            const fnBody = fnNode.body ? fnNode.body.body : fnNode.body;
            const fnExpressions = utils.findNodes(fnBody, 'ExpressionStatement');

            fnExpressions.forEach((fnExpression) => {
              const fnCallee = fnExpression.expression.callee;

              if (
                utils.isMemberExpression(fnCallee) &&
                utils.isThisExpression(fnCallee.object) &&
                utils.isIdentifier(fnCallee.property) &&
                fnCallee.property.name === 'set'
              ) {
                report(fnExpression);
              }
            });
          });
        }
      },
    };
  }
};
