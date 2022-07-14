'use strict';

const emberUtils = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  'The `index` route is automatically provided and does not need to be defined.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary `index` route definition',
      category: 'Routes',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unnecessary-index-route.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (!emberUtils.isRoute(node)) {
          return;
        }

        if (node.arguments[0].value !== 'index') {
          return;
        }

        context.report({
          node,
          message: ERROR_MESSAGE,
        });
      },
    };
  },
};
