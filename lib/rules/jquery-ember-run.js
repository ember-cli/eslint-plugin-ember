'use strict';

var utils = require('../utils/utils');
var ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don’t use jQuery without Ember Run Loop
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Don\'t use jQuery without Ember Run Loop';

  var report = function(node) {
    context.report(node, message);
  };

  var isJqueryUsed = function(node) {
    return utils.isMemberExpression(node) &&
      utils.isCallExpression(node.object) &&
      ember.isModule(node.object, '$');
  };

  var isRunUsed = function(node) {
    return ember.isModule(node, 'run');
  };

  return {
    CallExpression: function(node) {
      var callee = node.callee;
      var fnNodes = utils.findNodes(node.arguments, 'ArrowFunctionExpression');

      if (isJqueryUsed(callee) && fnNodes.length) {
        fnNodes.forEach(function(fnNode) {
          var fnBody = fnNode.body.body;
          var fnExpressions = utils.findNodes(fnBody, 'ExpressionStatement');

          fnExpressions.forEach(function(fnExpression) {
            fnExpression = fnExpression.expression;

            if (
              utils.isCallExpression(fnExpression) &&
              utils.isMemberExpression(fnExpression.callee) &&
              !isRunUsed(fnExpression)
            ) {
              report(fnExpression.callee);
            }
          });
        });
      }
    }
  };

};
