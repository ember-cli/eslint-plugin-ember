'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't create new mixins
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't create new mixins";

module.exports = {
  meta: {
    docs: {
      description: 'Prevents creation of new mixins',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null, // or "code" or "whitespace"
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (ember.isEmberMixin(context, node)) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
