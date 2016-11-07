'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

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
  } else if (isAnyProp(property)) {
    val = 20;
  } else if (isSingleLineFn(property)) {
    val = 30;
  } else if (isMultiLineFn(property)) {
    val = 40;
  } else if (isObserverProp(property)) {
    val = 50;
  } else if (isLifecycleHook(property)) {
    val = 60;
  } else if (isActionsProp(property)) {
    val = 70;
  } else if (isCustomFunction(property)) {
    val = 80;
  }

  return val;
};

function isAnyProp(property) {
  return ember.isCustomProp(property);
};

function isInjectedServiceProp(property) {
  return ember.isInjectedServiceProp(property.value);
};

function isSingleLineFn(property) {
  return utils.isCallExpression(property.value) &&
    utils.getSize(property.value) === 1 &&
    !ember.isObserverProp(property.value) &&
    !utils.isCallWithFunctionExpression(property.value);
};

function isMultiLineFn(property) {
  return utils.isCallExpression(property.value) &&
    utils.getSize(property.value) > 1 &&
    !ember.isObserverProp(property.value) &&
    !utils.isCallWithFunctionExpression(property.value);
};

function isObserverProp(property) {
  return ember.isObserverProp(property.value);
};

function isActionsProp(property) {
  return property.key.name === 'actions' && utils.isObjectExpression(property.value);
};

function isCustomFunction(property) {
  return (
    utils.isFunctionExpression(property.value) ||
    utils.isCallWithFunctionExpression(property.value)
  ) && !ember.isComponentLifecycleHookName(property.key.name);
};

function isLifecycleHook(property) {
  return utils.isFunctionExpression(property.value) &&
    ember.isComponentLifecycleHookName(property.key.name);
};
