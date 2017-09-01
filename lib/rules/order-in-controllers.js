'use strict';

const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;
const addBackwardsPosition = propOrder.addBackwardsPosition;

const ORDER = [
  'service',
  'query-params',
  'inherited-property',
  'property',
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
    docs: {
      description: 'Enforces proper order of properties in controllers',
      category: 'Organizing',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const options = context.options[0] || {};
    const filePath = context.getFilename();
    const order = options.order ? addBackwardsPosition(options.order, 'empty-method', 'method') : ORDER;

    return {
      CallExpression(node) {
        if (!ember.isEmberController(node, filePath)) return;

        reportUnorderedProperties(node, context, 'controller', order);
      },
    };
  }
};
