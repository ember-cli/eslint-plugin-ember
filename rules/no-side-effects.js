'use strict';

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Don\'t introduce side-effects in computed properties';

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      var callee = node.callee;
      var fnNodes = utils.findNodes(node.arguments, 'FunctionExpression');

      if (callee && callee.name == 'computed' && fnNodes) {
        fnNodes.forEach(function(fnNode) {
          var fnBody = fnNode.body ? fnNode.body.body : fnNode.body;
          var fnExpressions = utils.findNodes(fnBody, 'ExpressionStatement');

          fnExpressions.forEach(function(fnExpression) {
            var fnCallee = fnExpression.expression.callee;

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
    }
  };

};
