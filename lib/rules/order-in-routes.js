'use strict';

var ember = require('../utils/ember');
var reportUnorderedProperties = require('../utils/property-order').reportUnorderedProperties;

const ORDER = [
  'service',
  'default-property',
  'property',
  'model',
  'lifecycle-hook',
  'actions',
  'method',
  'unknown',
];

const NAMES = {
  'service': 'service injection',
  'default-property': 'default property',
  'property': 'property',
  'model': 'model hook',
  'lifecycle-hook': 'lifecycle hook',
  'actions': 'actions hash',
  'method': 'custom method',
  'unknown': 'unknown property type',
};

function toType(node) {

  if (ember.isInjectedServiceProp(node.value)) {
    return 'service';
  } else if (ember.isRouteDefaultProp(node)) {
    return 'default-property';
  } else if (ember.isCustomProp(node)) {
    return 'property';
  } else if (ember.isModelProp(node)) {
    return 'model';
  } else if (ember.isRouteDefaultMethod(node)) {
    return 'lifecycle-hook';
  } else if (ember.isActionsProp(node)) {
    return 'actions';
  } else if (ember.isRouteCustomFunction(node)) {
    return 'method';
  } else {
    return 'unknown';
  }
}

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  var message = 'Check order of properties';

  function report(node) {
    context.report(node, message);
  }

  return {
    CallExpression: function(node) {
      if (!ember.isEmberRoute(node)) return;

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
