'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;
const addBackwardsPosition = propOrder.addBackwardsPosition;

const ORDER = [
  'service',
  'property',
  'empty-method',
  'single-line-function',
  'multi-line-function',
  'observer',
  'init',
  'didReceiveAttrs',
  'willRender',
  'willInsertElement',
  'didInsertElement',
  'didRender',
  'didUpdateAttrs',
  'willUpdate',
  'didUpdate',
  'willDestroyElement',
  'willClearRender',
  'didDestroyElement',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforces proper order of properties in components',
      category: 'Stylistic Issues',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/order-in-components.md',
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
    let order = options.order
      ? addBackwardsPosition(options.order, 'empty-method', 'method')
      : ORDER;
    order = order.slice(0);
    const indexOfLifecycleHook = order.indexOf('lifecycle-hook');

    if (indexOfLifecycleHook !== -1) {
      order.splice(indexOfLifecycleHook, 1, [
        'init',
        'didReceiveAttrs',
        'willRender',
        'willInsertElement',
        'didInsertElement',
        'didRender',
        'didUpdateAttrs',
        'willUpdate',
        'didUpdate',
        'willDestroyElement',
        'willClearRender',
        'didDestroyElement',
      ]);
    }

    return {
      'CallExpression > MemberExpression[property.name="extend"]'(memberExpressionNode) {
        const node = memberExpressionNode.parent;

        if (!ember.isEmberComponent(context, node)) {
          return;
        }

        reportUnorderedProperties(node, context, 'component', order);
      },
    };
  },
};
