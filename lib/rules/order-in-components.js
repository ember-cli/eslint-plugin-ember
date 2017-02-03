'use strict';

var ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  var message = 'Check order of properties';

  function report(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if (!ember.isEmberComponent(node)) return;

      var properties = ember.getModuleProperties(node).map(function(property) {
        return new ComponentPropertyInfo(property);
      });

      var maxOrder = -1;
      properties.forEach(function(property) {
        if (property.order < maxOrder) {
          report(property.node);
        } else {
          maxOrder = property.order;
        }
      });
    }
  }
};

const ORDER = [
  'service',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'lifecycle-hook',
  'actions',
  'method',
  'unknown',
];

function ComponentPropertyInfo(node) {
  this.node = node;
  this.type = this._getType();
  this.order = ORDER.indexOf(this.type);
}

ComponentPropertyInfo.prototype._getType = function() {
  if (ember.isInjectedServiceProp(this.node.value)) {
    return 'service';
  } else if (ember.isCustomProp(this.node)) {
    return 'property';
  } else if (ember.isSingleLineFn(this.node)) {
    return 'single-line-function';
  } else if (ember.isMultiLineFn(this.node)) {
    return 'multi-line-function';
  } else if (ember.isObserverProp(this.node.value)) {
    return 'observer';
  } else if (ember.isComponentLifecycleHook(this.node)) {
    return 'lifecycle-hook';
  } else if (ember.isActionsProp(this.node)) {
    return 'actions';
  } else if (ember.isComponentCustomFunction(this.node)) {
    return 'method';
  } else {
    return 'unknown';
  }
};
