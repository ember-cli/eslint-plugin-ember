'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var determinePropertyType = propOrder.determinePropertyType;
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
  'unknown',
];

const NAMES = {
  'service': 'service injection',
  'property': 'property',
  'single-line-function': 'single-line function',
  'multi-line-function': 'multi-line function',
  'observer': 'observer',
  'lifecycle-hook': 'lifecycle hook',
  'actions': 'actions hash',
  'method': 'custom method',
  'unknown': 'unknown property type',
};

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isEmberComponent(node)) return;

      reportUnorderedProperties(node, context, function(property) {
        var type = determinePropertyType(property, 'component');

        return {
          node: property,
          name: NAMES[type],
          order: ORDER.indexOf(type)
        };
      });
    }
  }
};
