'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'attribute',
  'relationship',
  'single-line-function',
  'multi-line-function',
];

//------------------------------------------------------------------------------
// Organizing - Organize your models
// Attributes -> Relations -> Computed Properties
//------------------------------------------------------------------------------

module.exports = function(context) {
  var options = context.options[0] || {};
  var order = options.order || ORDER;

  return {
    CallExpression: function(node) {
      if (!ember.isDSModel(node)) return;

      reportUnorderedProperties(node, context, 'model', order);
    }
  };
};
