'use strict';

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    CallExpression: function(node) {
      var callee = node.callee;
      var isObserver = callee.name === 'observer';
      var isEmberObserver = false;

      if (!isObserver && callee.object) {
        isEmberObserver = callee.object.name === 'Ember' && callee.property.name === 'observer';
      }

      if (isEmberObserver || isObserver) {
        context.report(node, 'Don\'t use observers if possible');
      }
    }
  };

};
