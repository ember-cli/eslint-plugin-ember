'use strict';

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// General rule - Use named functions defined on objects to handle promises
//------------------------------------------------------------------------------

module.exports = function(context) {

  var promisesMethods = ['then', 'catch', 'success'];

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
            context.report(node, 'Use named functions defined on objects to handle promises');
          }
        });
      }
    }
  };

};
