'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;
const addBackwardsPosition = propOrder.addBackwardsPosition;

const ORDER = [
  'spread',
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
    type: 'layout',
    docs: {
      description: 'enforce proper order of properties in models',
      category: 'Stylistic Issues',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/order-in-models.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const order = options.order
      ? addBackwardsPosition(options.order, 'empty-method', 'method')
      : ORDER;
    const filePath = context.getFilename();

    return {
      CallExpression(node) {
        if (!ember.isDSModel(node, filePath)) {
          return;
        }

        reportUnorderedProperties(node, context, 'model', order);
      },
    };
  },
};
