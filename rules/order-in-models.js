'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

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

  if (isAttr(property)) {
    val = 10;
  } else if (isRelation(property)) {
    val = 20;
  } else if (isSingleLine(property)) {
    val = 30;
  } else if (isMultiLine(property)) {
    val = 40;
  }

  return val;
}

function isAttr(property) {
  return ember.isModule(property.value, 'attr', 'DS');
}

function isRelation(property) {
  var relationAttrs = ['hasMany', 'belongsTo'];
  var result = false;

  relationAttrs.forEach(function(relation) {
    if (ember.isModule(property.value, relation, 'DS')) {
      result = true;
    }
  });

  return result;
}

function isSingleLine(property) {
  return ember.isSingleLineFn(property);
}

function isMultiLine(property) {
  return ember.isMultiLineFn(property);
}
