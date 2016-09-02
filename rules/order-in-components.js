'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Check order of properties';

  var report = function(node) {
    context.report(node, message);
  };

  var isDefaultProp = function(property) {
    var value = property.value;

    return utils.isLiteral(value) ||
      utils.isArrayExpression(value) ||
      isDefaultObjectProp(property);
  };

  var isInjectedServiceProp = function(property) {
    return ember.isInjectedServiceProp(property.value);
  };

  var isSingleLineFn = function(property) {
    return utils.isCallExpression(property.value) &&
      utils.getSize(property.value) === 1 &&
      !utils.isCallWithFunctionExpression(property.value);
  };

  var isMultiLineFn = function(property) {
    return utils.isCallExpression(property.value) &&
      utils.getSize(property.value) > 1 &&
      !ember.isObserverProp(property.value) &&
      !utils.isCallWithFunctionExpression(property.value);
  };

  var isObserverProp = function(property) {
    return ember.isObserverProp(property.value);
  };

  var isActionsProp = function(property) {
    return property.key.name === 'actions' && utils.isObjectExpression(property.value);
  };

  var isDefaultObjectProp = function(property) {
    return property.key.name !== 'actions' && utils.isObjectExpression(property.value);
  };

  var isCustomFunction = function(property) {
    return (
      utils.isFunctionExpression(property.value) || utils.isCallWithFunctionExpression(property.value)
    ) && !ember.isComponentLifecycleHookName(property.key.name);
  };

  var isLifecycleHook = function(property) {
    return utils.isFunctionExpression(property.value) &&
      ember.isComponentLifecycleHookName(property.key.name);
  };

  var getOrderValue = function(property) {
    var val = null;

    if (isInjectedServiceProp(property)) {
      val = 10;
    } else if (isDefaultProp(property)) {
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

  var findUnorderedProperty = function(arr) {
    var len = arr.length - 1;
    for(var i = 0; i < len; ++i) {
      if(arr[i].order > arr[i+1].order) {
        return arr[i];
      }
    }
    return null;
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

      var unorderedProperty = findUnorderedProperty(mappedProperties);

      if (unorderedProperty) {
        report(unorderedProperty.node);
      }
    }
  };

};
