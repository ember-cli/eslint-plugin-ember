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

module.exports = function (context) {
  const options = context.options[0] || {};
  const order = options.order || ORDER;

  return {
    CallExpression(node) {
      if (!ember.isEmberComponent(node)) return;

      reportUnorderedProperties(node, context, 'component', order);
    },
  };
};
