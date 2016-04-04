'use strict';

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Don\'t introduce side-effects in computed properties';

  var findNodes = function (body, nodeName) {
    var nodesArray = [];

    if (body) {
      nodesArray = body.filter(function (node) {
        return node.type === nodeName;
      });
    }

    return nodesArray;
  };

  return {
    CallExpression: function(node) {
      var callee = node.callee;
      var fnNodes = findNodes(node.arguments, 'FunctionExpression');

      if (callee && callee.name == 'computed' && fnNodes) {
        fnNodes.forEach(function(fnNode) {
          var fnBody = fnNode.body ? fnNode.body.body : fnNode.body;
          var fnExpressions = findNodes(fnBody, 'ExpressionStatement');

          fnExpressions.forEach(function(fnExpression) {
            var fnCallee = fnExpression.expression.callee;

            if (
              fnCallee.object &&
              fnCallee.object.type === 'ThisExpression' &&
              fnCallee.property &&
              fnCallee.property.name === 'set'
            ) {
              context.report(fnExpression, message);
            }
          });
        });
      }
    }
  };

};
