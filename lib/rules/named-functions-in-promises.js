'use strict';

var utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule - Use named functions defined on objects to handle promises
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use named functions defined on objects to handle promises';

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      var firstArg = node.arguments[0];

      if (
        hasPromiseExpression(node) &&
        (
          utils.isFunctionExpression(firstArg) ||
          utils.isArrowFunctionExpression(firstArg)
        )
      ) {
        report(node);
      }
    }
  };

  function hasPromiseExpression(node) {
    var callee = node.callee;
    var promisesMethods = ['then', 'catch', 'finally'];

    return utils.isCallExpression(callee.object) &&
      utils.isIdentifier(callee.property) &&
      promisesMethods.indexOf(callee.property.name) > -1;
  }
};
