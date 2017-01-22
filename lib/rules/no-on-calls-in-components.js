'use strict';

var ember = require('../utils/ember');
var utils = require('../utils/utils');

//----------------------------------------------
// General rule - Don\'t use .on() in components
//----------------------------------------------

module.exports = function(context) {

  var message = 'Don\'t use .on() in components';

  var isOnCall = function (node) {
    var value = node.value;
    var callee = value.callee;

    return utils.isCallExpression(value) &&
      (utils.isIdentifier(callee) && callee.name === 'on') ||
      (
        utils.isMemberExpression(callee) &&
        utils.isIdentifier(callee.object) && callee.object.name === 'Ember' &&
        utils.isIdentifier(callee.property) && callee.property.name === 'on'
      );
  };

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if (!ember.isEmberComponent(node)) return;

      var propertiesWithOnCalls = ember.getModuleProperties(node).filter(isOnCall);

      if (propertiesWithOnCalls.length) {
        report(node);
      }
    }
  };
};
