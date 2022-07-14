'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't create new mixins
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't create new mixins";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the creation of new mixins',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-new-mixins.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (ember.isEmberMixin(context, node)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },

      ClassDeclaration(node) {
        if (ember.isEmberMixin(context, node)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
