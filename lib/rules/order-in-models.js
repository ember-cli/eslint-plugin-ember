'use strict';

var utils = require('../utils/utils');
var ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Organizing - Organize your models
// Attributes -> Relations -> Computed Properties
//------------------------------------------------------------------------------

module.exports = function(context) {
  var message = 'Check order of properties';

  function report(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if (!ember.isDSModel(node)) return;

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

  if (ember.isModule(property.value, 'attr', 'DS')) {
    val = 10;
  } else if (ember.isRelation(property)) {
    val = 20;
  } else if (ember.isSingleLineFn(property)) {
    val = 30;
  } else if (ember.isMultiLineFn(property)) {
    val = 40;
  } else {
    val = 50;
  }

  return val;
}
