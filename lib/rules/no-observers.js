'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of observers',
      category: 'General',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
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
  }
};
