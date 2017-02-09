'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'inherited-property',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  var options = context.options[0] || {};
  var order = options.order || ORDER;

  return {
    CallExpression: function(node) {
      if (!ember.isEmberController(node)) return;

      reportUnorderedProperties(node, context, 'controller', order);
    }
  };
};

