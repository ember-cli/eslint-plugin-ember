'use strict';

var utils = require('./utils/utils');

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
      utils.isMemberExpression(node.object.callee) &&
      utils.isIdentifier(node.object.callee.object) &&
      utils.isIdentifier(node.object.callee.property) &&
      node.object.callee.object.name === 'Ember' &&
      node.object.callee.property.name === '$';
  };

  var isEmberRunUsed = function(node) {
    return utils.isMemberExpression(node.object) &&
      utils.isIdentifier(node.object.object) &&
      utils.isIdentifier(node.object.property) &&
      utils.isIdentifier(node.property) &&
      node.object.object.name === 'Ember' &&
      node.object.property.name === 'run' &&
      node.property.name === 'bind';
  };

  var isRunUsed = function(node) {
    return utils.isIdentifier(node.object) &&
      utils.isIdentifier(node.property) &&
      node.object.name === 'run' &&
      node.property.name === 'bind';
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
              !isEmberRunUsed(fnExpression.callee) &&
              !isRunUsed(fnExpression.callee)
            ) {
              report(fnExpression.callee);
            }
          });
        });
      }
    }
  };

};
