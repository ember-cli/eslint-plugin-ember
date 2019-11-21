'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;
const addBackwardsPosition = propOrder.addBackwardsPosition;

const ORDER = [
  'controller',
  'service',
  'query-params',
  'inherited-property',
  'property',
  'init',
  'single-line-function',
  'multi-line-function',
  'observer',
  'actions',
  ['method', 'empty-method'],
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforces proper order of properties in controllers',
      category: 'Stylistic Issues',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/order-in-controllers.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
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

    return {
      'CallExpression > MemberExpression[property.name="extend"]'(memberExpressionNode) {
        const node = memberExpressionNode.parent;

        if (!ember.isEmberController(context, node)) {
          return;
        }

        reportUnorderedProperties(node, context, 'controller', order);
      },
    };
  },
};
