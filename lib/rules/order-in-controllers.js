const ember = require('../utils/ember');
const propOrder = require('../utils/property-order');

const reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'inherited-property',
  'property',
  'single-line-function',
  'multi-line-function',
  'observer',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = function (context) {
  const options = context.options[0] || {};
  const order = options.order || ORDER;

  return {
    CallExpression(node) {
      if (!ember.isEmberController(node)) return;

      reportUnorderedProperties(node, context, 'controller', order);
    },
  };
};

