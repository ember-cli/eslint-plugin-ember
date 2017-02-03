'use strict';

var ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isEmberComponent(node)) return;

      var maxOrder = -1;
      var firstPropertyOfType = {};

      ember.getModuleProperties(node).forEach(function(property) {
        var info = new ComponentPropertyInfo(property);

        // check if this property should be moved further upwards
        if (info.order < maxOrder) {

          // look for correct position to insert this property
          for (var i = info.order + 1; i < ORDER.length; i++) {
            var firstPropertyOfNextType = firstPropertyOfType[i];
            if (firstPropertyOfNextType) {
              break;
            }
          }

          var typeName = info.name;
          var nextTypeName = firstPropertyOfNextType.name;
          var nextSourceLine = firstPropertyOfNextType.node.loc.start.line;

          context.report(property,
            `The ${typeName} should be above the ${nextTypeName} on line ${nextSourceLine}`);

        } else {
          maxOrder = info.order;

          if (!(info.order in firstPropertyOfType)) {
            firstPropertyOfType[info.order] = info;
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
  this.type = this._getType(node);
  this.name = NAMES[this.type];
  this.order = ORDER.indexOf(this.type);
}

ComponentPropertyInfo.prototype._getType = function(node) {
  if (ember.isInjectedServiceProp(node.value)) {
    return 'service';
  } else if (ember.isCustomProp(node)) {
    return 'property';
  } else if (ember.isSingleLineFn(node)) {
    return 'single-line-function';
  } else if (ember.isMultiLineFn(node)) {
    return 'multi-line-function';
  } else if (ember.isObserverProp(node.value)) {
    return 'observer';
  } else if (ember.isComponentLifecycleHook(node)) {
    return 'lifecycle-hook';
  } else if (ember.isActionsProp(node)) {
    return 'actions';
  } else if (ember.isComponentCustomFunction(node)) {
    return 'method';
  } else {
    return 'unknown';
  }
};
