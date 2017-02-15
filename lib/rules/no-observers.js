'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

module.exports = function (context) {
  const message = "Don't use observers if possible";

  const report = function (node) {
    context.report(node, message);
  };

  return {
    CallExpression(node) {
      if (ember.isModule(node, 'observer')) {
        report(node);
      }
    },
  };
};
