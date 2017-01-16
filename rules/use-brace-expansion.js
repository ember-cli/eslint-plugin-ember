'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

//------------------------------------------------------------------------------
// General rule - Use brace expansion
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use brace expansion';

  function report(node) {
    context.report(node, message);
  }

  return {
    CallExpression: function(node) {
      var callee = node.callee;

      if (ember.isComputedProp(node)) {
        var properties = node.arguments
          .filter(arg => utils.isLiteral(arg) && typeof arg.value === 'string')
          .map(e => e.value.split('.'))
          .filter(e => e.length > 1)
          .map(e => e[0])
          .sort((a, b) => a > b);

        for (var i = 0; i < properties.length - 1; i++) {
          if (properties[i] === properties[i+1]) {
            return report(node);
          }
        }
      }
    }
  };

};
