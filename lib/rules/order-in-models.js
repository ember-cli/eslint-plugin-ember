'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;
const addBackwardsPosition = propOrder.addBackwardsPosition;

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

module.exports = {
  meta: {
    docs: {
      description: 'Enforces proper order of properties in models',
      category: 'Organizing',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const options = context.options[0] || {};
    let order = options.order || ORDER;
    order = addBackwardsPosition(order, 'empty-method', 'method');

    return {
      CallExpression(node) {
        if (!ember.isDSModel(node)) return;

        reportUnorderedProperties(node, context, 'model', order);
      },
    };
  }
};
