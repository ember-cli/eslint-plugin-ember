'use strict';

var ember = require('./utils/ember');

//------------------------------------------------------------------------------
// General rule - Query params should always be on top
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Query params should always be on top';

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if (!ember.isEmberController(node)) return;

      var properties = node.arguments[0].properties;

      var propKeys = properties.map(function(property) {
        return property.key.name;
      });

      if (propKeys.indexOf('queryParams') > 0) {
        report(node);
      }
    }
  };

};
