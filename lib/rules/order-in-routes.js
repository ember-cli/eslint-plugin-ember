'use strict';

var ember = require('../utils/ember');
var propOrder = require('../utils/property-order');

var reportUnorderedProperties = propOrder.reportUnorderedProperties;

const ORDER = [
  'service',
  'default-property',
  'property',
  'model',
  'lifecycle-hook',
  'actions',
  'method',
];

//------------------------------------------------------------------------------
// Organizing - Organize your routes and keep order in objects
//------------------------------------------------------------------------------

module.exports = function(context) {
  var options = context.options[0] || {};
  var order = options.order || ORDER;

  return {
    CallExpression: function(node) {
      if (!ember.isEmberRoute(node)) return;

      reportUnorderedProperties(node, context, 'route', order);
    }
  };
};
