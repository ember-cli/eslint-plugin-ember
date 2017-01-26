'use strict';

var utils = require('../utils/utils');
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
  }
};

function getOrderValue(property) {
  var val = null;

  if (ember.isInjectedServiceProp(property.value)) {
    val = 10;
  } else if (ember.isCustomProp(property)) {
    val = 20;
  } else if (ember.isSingleLineFn(property)) {
    val = 30;
  } else if (ember.isMultiLineFn(property)) {
    val = 40;
  } else if (ember.isObserverProp(property.value)) {
    val = 50;
  } else if (ember.isComponentLifecycleHook(property)) {
    val = 60;
  } else if (ember.isActionsProp(property)) {
    val = 70;
  } else if (ember.isComponentCustomFunction(property)) {
    val = 80;
  }

  return val;
}
