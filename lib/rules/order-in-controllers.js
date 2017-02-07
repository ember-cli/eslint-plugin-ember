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

const NAMES = {
  'service': 'service injection',
  'default-property': 'default property',
  'property': 'property',
  'single-line-function': 'single-line function',
  'multi-line-function': 'multi-line function',
  'observer': 'observer',
  'actions': 'actions hash',
  'method': 'custom method',
  'unknown': 'unknown property type',
};

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
          name: NAMES[type],
          order: ORDER.indexOf(type)
        };
      });
    }
  };
};

