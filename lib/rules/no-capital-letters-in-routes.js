'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');

//------------------------------------------------------------------------------
// Routing - No capital letters in routes
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow routes with uppercased letters in router.js',
      category: 'Routes',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-capital-letters-in-routes.md',
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    const report = function (node) {
      context.report({ node, message: "Unexpected capital letter in route's name" });
    };

    return {
      CallExpression(node) {
        if (ember.isRoute(node) && node.arguments[0] && types.isLiteral(node.arguments[0])) {
          const routeName = node.arguments[0].value;
          const hasAnyUppercaseLetter = Boolean(routeName.match('[A-Z]'));

          if (hasAnyUppercaseLetter) {
            report(node);
          }
        }
      },
    };
  },
};
