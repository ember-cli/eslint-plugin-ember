'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'inherited-property',
  'property',
  'single-line-function',
  'multi-line-function',
  'model',
  'lifecycle-hook',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {}
  },

  create(context) {
    const options = context.options[0] || {};
    const order = options.order || ORDER;
    const filePath = context.getFilename();

    return {
      CallExpression(node) {
        if (!ember.isEmberRoute(node, filePath)) return;

        reportUnorderedProperties(node, context, 'route', order);
      },
    };
  }
};
