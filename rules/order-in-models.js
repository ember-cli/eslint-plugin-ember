'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

//------------------------------------------------------------------------------
// Organizing - Organize your models
// Attributes -> Relations -> Computed Properties
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Check order of properties';

  var report = function(node) {
    context.report(node, message);
  };

  var isAttr = function(property) {
    return ember.isModule(property.value, 'attr', 'DS');
  };

  var isRelation = function(property) {
    var relationAttrs = ['hasMany', 'belongsTo'];
    var result = false;

    relationAttrs.forEach(function(relation) {
      if (ember.isModule(property.value, relation, 'DS')) {
        result = true;
      }
    });

    return result;
  };

  var isSingleLine = function(property) {
    return utils.isCallExpression(property.value) && utils.getSize(property.value) === 1;
  };

  var isMultiLine = function(property) {
    return utils.isCallExpression(property.value) && utils.getSize(property.value) > 1;
  };

  var getOrderValue = function(property) {
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
      if (!ember.isDSModel(node)) return;

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
