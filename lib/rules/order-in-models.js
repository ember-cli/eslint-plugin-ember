'use strict';

var ember = require('../utils/ember');
var reportUnorderedProperties = require('../utils/property-order').reportUnorderedProperties;

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

function toType(node) {
  if (ember.isModule(node.value, 'attr', 'DS')) {
    return 'attribute';
  } else if (ember.isRelation(node)) {
    return 'relationship';
  } else if (ember.isSingleLineFn(node)) {
    return 'single-line-function';
  } else if (ember.isMultiLineFn(node)) {
    return 'multi-line-function';
  } else {
    return 'other';
  }
}

//------------------------------------------------------------------------------
// Organizing - Organize your models
// Attributes -> Relations -> Computed Properties
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (!ember.isDSModel(node)) return;

      reportUnorderedProperties(node, context, function(property) {
        var type = toType(property);

        return {
          node: property,
          name: NAMES[type],
          order: ORDER.indexOf(type)
        };
      });
    }
  };
};
