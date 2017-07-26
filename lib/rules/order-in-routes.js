'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;
const addBackwardsPosition = propOrder.addBackwardsPosition;

const ORDER = [
  'service',
  'inherited-property',
  'property',
  'single-line-function',
  'multi-line-function',
  'model',
  'lifecycle-hook',
  'actions',
  ['method', 'empty-method'],
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces proper order of properties in routes',
      category: 'Organizing',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const options = context.options[0] || {};
    const filePath = context.getFilename();
    let order = options.order || ORDER;
    order = addBackwardsPosition(order, 'empty-method', 'method');

    return {
      CallExpression(node) {
        if (!ember.isEmberRoute(node, filePath)) return;

        reportUnorderedProperties(node, context, 'route', order);
      },
    };
  }
};
