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
      var firstPropertyOfType = {};
      properties.forEach(function(property) {

        // check if this property should be moved further upwards
        if (property.order < maxOrder) {

          // look for correct position to insert this property
          for (var i = property.order + 1; i < ORDER.length; i++) {
            var firstPropertyOfNextType = firstPropertyOfType[i];
            if (firstPropertyOfNextType) {
              break;
            }
          }

          var typeName = NAMES[property.type];
          var nextTypeName = NAMES[firstPropertyOfNextType.type];
          var nextSourceLine = firstPropertyOfNextType.node.loc.start.line;

          context.report(property.node,
            `The ${typeName} should be above the ${nextTypeName} on line ${nextSourceLine}`);

        } else {
          maxOrder = property.order;

          if (!(property.order in firstPropertyOfType)) {
            firstPropertyOfType[property.order] = property;
          }
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

const NAMES = {
  'service': 'service injection',
  'property': 'property',
  'single-line-function': 'single-line function',
  'multi-line-function': 'multi-line function',
  'observer': 'observer',
  'lifecycle-hook': 'lifecycle hook',
  'actions': 'actions hash',
  'method': 'custom method',
  'unknown': 'unknown property type',
};

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
