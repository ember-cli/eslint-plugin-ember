'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var determinePropertyType = propOrder.determinePropertyType;
var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'attribute',
  'relationship',
  'single-line-function',
  'multi-line-function',
  'other',
];

const NAMES = {
  'attribute': 'attribute',
  'relationship': 'relationship',
  'single-line-function': 'single-line function',
  'multi-line-function': 'multi-line function',
  'other': 'property',
};

//------------------------------------------------------------------------------
// Organizing - Organize your models
// Attributes -> Relations -> Computed Properties
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isDSModel(node)) return;

      reportUnorderedProperties(node, context, function(property) {
        var type = determinePropertyType(property, 'model');

        return {
          node: property,
          name: NAMES[type],
          order: ORDER.indexOf(type)
        };
      });
    }
  };
};
