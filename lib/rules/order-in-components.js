'use strict';

var ember = require('../utils/ember');
var reportUnorderedProperties = require('../utils/property-order').reportUnorderedProperties;

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isEmberComponent(node)) return;

      reportUnorderedProperties(node, context, function(property) {
        var type = toType(property);

        return {
          node: property,
          name: NAMES[type],
          order: ORDER.indexOf(type)
        };
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

function toType(node) {
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
}
