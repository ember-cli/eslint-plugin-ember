'use strict';

//------------------------------------------------------------------------------
// General rule - Create local version of Ember.* and DS.*
//------------------------------------------------------------------------------

module.exports = function(context) {

  var allowedEmberProperties = ['$', 'Object'];
  var allowedDSProperties = [];

  var isExpressionForbidden = function (objectName, node, allowedProperties) {
    return node.object.name === objectName &&
      node.property.name.length &&
      allowedProperties.indexOf(node.property.name) === -1;
  };

  return {
    MemberExpression: function(node) {
      if (isExpressionForbidden('Ember', node, allowedEmberProperties)) {
        context.report(node, 'Create local version of Ember.' + node.property.name);
      }

      if (isExpressionForbidden('DS', node, allowedDSProperties)) {
        context.report(node, 'Create local version of DS.' + node.property.name);
      }
    }
  };

};
