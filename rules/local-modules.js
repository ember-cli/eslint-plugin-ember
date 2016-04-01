'use strict';

//------------------------------------------------------------------------------
// General rule - Create local version of Ember.* and DS.*
//------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    MemberExpression: function(node) {
      if (node.object.name === 'Ember' && node.property.name.length) {
        context.report(node, 'Create local version of Ember.*');
      }

      if (node.object.name === 'DS' && node.property.name.length) {
        context.report(node, 'Create local version of DS.*');
      }
    }
  };

};
