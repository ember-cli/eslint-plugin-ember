'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;

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
    docs: {}
  },

  create: function (context) {
    const options = context.options[0] || {};
    const order = options.order || ORDER;

    return {
      CallExpression(node) {
        if (!ember.isDSModel(node)) return;

        reportUnorderedProperties(node, context, 'model', order);
      },
    };
  }
};
