'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'attribute',
  'relationship',
  'single-line-function',
  'multi-line-function',
  'other',
];

//------------------------------------------------------------------------------
// Organizing - Organize your models
// Attributes -> Relations -> Computed Properties
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isDSModel(node)) return;

      reportUnorderedProperties(node, context, 'model', ORDER);
    }
  };
};
