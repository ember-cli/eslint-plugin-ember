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
    return utils.isLiteral(property.value);
  };

  var isSingleLineFn = function(property) {
    return utils.isCallExpression(property.value) && utils.getSize(property.value) === 1;
  };

  var isMultiLineFn = function(property) {
    return utils.isCallExpression(property.value) && utils.getSize(property.value) > 1;
  };

  var isActionsProp = function(property) {
    return property.key.name === 'actions' && utils.isObjectExpression(property.value);
  };

  var getOrderValue = function(property) {
    var val = null;

    if (isDefaultProp(property)) {
      val = 10;
    } else if (isSingleLineFn(property)) {
      val = 20;
    } else if (isMultiLineFn(property)) {
      val = 30;
    } else if (isActionsProp(property)) {
      val = 40;
    }

    return val;
  }

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

      var properties = node.arguments[0].properties;
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
