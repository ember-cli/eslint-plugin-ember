'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Use brace expansion
//------------------------------------------------------------------------------

module.exports = function (context) {
  const message = 'Use brace expansion';

  function report(node) {
    context.report(node, message);
  }

  return {
    CallExpression(node) {
      if (!ember.isComputedProp(node)) return;

      const properties = node.arguments
        .filter(arg => utils.isLiteral(arg) && typeof arg.value === 'string')
        .map(e => e.value.split('.'))
        .filter(e => e.length > 1)
        .map(e => e[0])
        .sort((a, b) => a > b);

      for (let i = 0; i < properties.length - 1; i++) {
        if (properties[i] === properties[i + 1]) {
          report(node);
        }
      }
    },
  };
};
