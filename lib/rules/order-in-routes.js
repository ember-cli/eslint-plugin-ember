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
  var message = 'Check order of properties';

  function report(node) {
    context.report(node, message);
  }

  return {
    CallExpression: function(node) {
      if (!ember.isEmberRoute(node)) return;

      reportUnorderedProperties(node, context, 'route', ORDER);
    }
  };
};
