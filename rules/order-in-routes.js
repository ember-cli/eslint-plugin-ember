'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

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

      var properties = ember.getModuleProperties(node);
      var mappedProperties = properties.map(function(property) {
        return {
          node: property,
          order: getOrderValue(property)
        };
      });

      var unorderedProperty = utils.findUnorderedProperty(mappedProperties);

      if (unorderedProperty) {
        report(unorderedProperty.node);
      }
    }
  };
};

function getOrderValue(property) {
  var val = null;

  if (isInjectedServiceProp(property)) {
    val = 10;
  } else if (isDefaultProp(property)) {
    val = 20;
  } else if (isCustomProp(property)) {
    val = 30;
  } else if (isModelProp(property)) {
    val = 40;
  } else if (isDefaultMethod(property)) {
    val = 50;
  } else if (isActionsProp(property)) {
    val = 60;
  } else if (isCustomFunction(property)) {
    val = 70;
  }

  return val;
}

function isInjectedServiceProp(property) {
  return ember.isInjectedServiceProp(property.value);
}

function isDefaultProp(property) {
  return ember.isRouteProperty(property.key.name) &&
    property.key.name !== 'actions';
}

function isCustomProp(property) {
  return ember.isCustomProp(property);
}

function isActionsProp(property) {
  return ember.isActionsProp(property);
}

function isModelProp(property) {
  return property.key.name === 'model' && utils.isFunctionExpression(property.value);
}

function isCustomFunction(property) {
  return ember.isFunctionExpression(property.value) &&
    !ember.isRouteMethod(property.key.name);
}

function isDefaultMethod(property) {
  return ember.isFunctionExpression(property.value) &&
    ember.isRouteMethod(property.key.name);
}
