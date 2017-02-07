'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'lifecycle-hook',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  var options = context.options[0] || {};
  var order = options.order || ORDER;

  return {
    CallExpression: function(node) {
      if (!ember.isEmberComponent(node)) return;

      reportUnorderedProperties(node, context, 'component', order);
    }
  }
};
