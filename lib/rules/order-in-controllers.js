'use strict';

var ember = require('../utils/ember');
var reportUnorderedProperties = require('../utils/property-order').reportUnorderedProperties;

const ORDER = [
  'service',
  'default-property',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'actions',
  'method',
  'unknown',
];

const NAMES = {
  'service': 'service injection',
  'default-property': 'default property',
  'property': 'property',
  'single-line-function': 'single-line function',
  'multi-line-function': 'multi-line function',
  'observer': 'observer',
  'actions': 'actions hash',
  'method': 'custom method',
  'unknown': 'unknown property type',
};

function toType(node) {
  if (ember.isInjectedServiceProp(node.value)) {
    return 'service';
  } else if (ember.isControllerDefaultProp(node)) {
    return 'default-property';
  } else if (ember.isCustomProp(node)) {
    return 'property';
  } else if (ember.isSingleLineFn(node)) {
    return 'single-line-function';
  } else if (ember.isMultiLineFn(node)) {
    return 'multi-line-function';
  } else if (ember.isObserverProp(node.value)) {
    return 'observer';
  } else if (ember.isActionsProp(node)) {
    return 'actions';
  } else if (ember.isFunctionExpression(node.value)) {
    return 'method';
  } else {
    return 'unknown';
  }
}

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isEmberController(node)) return;

      reportUnorderedProperties(node, context, function(property) {
        var type = toType(property);

        return {
          node: property,
          name: NAMES[type],
          order: ORDER.indexOf(type)
        };
      });
    }
  };
};

