'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'lifecycle-hook',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your components and keep order in objects
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces proper order of properties in components',
      category: 'Organizing',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const options = context.options[0] || {};
    const order = options.order || ORDER;
    const filePath = context.getFilename();

    return {
      CallExpression(node) {
        if (!ember.isEmberComponent(node, filePath)) return;

        reportUnorderedProperties(node, context, 'component', order);
      },
    };
  }
};
