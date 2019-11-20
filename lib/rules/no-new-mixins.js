'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't create new mixins
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't create new mixins";

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevents creation of new mixins',
      category: 'Best Practices',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-new-mixins.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (ember.isEmberMixin(context, node)) {
          context.report(node, ERROR_MESSAGE);
        }
      },

      ClassDeclaration(node) {
        if (ember.isEmberMixin(context, node)) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
