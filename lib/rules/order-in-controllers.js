'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var determinePropertyType = propOrder.determinePropertyType;
var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'default-property',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'actions',
  'method',
  'unknown',
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isEmberController(node)) return;

      reportUnorderedProperties(node, context, function(property) {
        var type = determinePropertyType(property, 'controller');

        return {
          node: property,
          type,
          order: ORDER.indexOf(type)
        };
      });
    }
  };
};

