'use strict';

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// General rule - Create local version of Ember.* and DS.*
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Create local version of ';

  var report = function(node, name) {
    var msg = message + name + '.' + node.property.name;
    context.report(node, msg);
  };

  var allowedEmberProperties = ['$', 'Object', 'Router'];
  var allowedDSProperties = [];

  var isExpressionForbidden = function (objectName, node, allowedProperties) {
    return node.object.name === objectName &&
      node.property.name.length &&
      allowedProperties.indexOf(node.property.name) === -1;
  };

  return {
    CallExpression: function(node) {
      var callee = node.callee;
      var obj;

      if (!utils.isMemberExpression(callee)) return;

      obj = utils.isMemberExpression(callee.object) ? callee.object : callee;

      if (
        utils.isIdentifier(obj.object) &&
        utils.isIdentifier(obj.property)
      ) {
        if (isExpressionForbidden('Ember', obj, allowedEmberProperties)) {
          report(obj, 'Ember');
        }

        if (isExpressionForbidden('DS', obj, allowedDSProperties)) {
          report(obj, 'DS');
        }
      }
    }
  };

};
