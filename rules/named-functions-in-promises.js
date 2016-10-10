'use strict';

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// General rule - Use named functions defined on objects to handle promises
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use named functions defined on objects to handle promises';

  var report = function(node) {
    context.report(node, message);
  };

  var promisesMethods = ['then', 'catch'];

  return {
    CallExpression: function(node) {
      var callee = node.callee;

      if (
        utils.isCallExpression(callee.object) &&
        utils.isIdentifier(callee.property) &&
        promisesMethods.indexOf(callee.property.name) > -1
      ) {
        node.arguments.forEach(function(argument) {
          if (!utils.isCallExpression(argument)) {
            report(node);
          }
        });
      }
    }
  };

};
