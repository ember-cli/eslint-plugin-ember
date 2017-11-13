'use strict';

const ember = require('../utils/ember');
//------------------------------------------------------------------------------
// Routing - No capital letters in routes
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Raise an error when there is a route with uppercased letters in router.js',
      category: 'Routing',
      recommended: true,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
  },
  create(context) {
    const report = function (node) {
      context.report(node, 'Unexpected capital letter in route\'s name');
    };

    return {
      CallExpression(node) {
        if (
          !ember.isRoute(node) ||
          !node.arguments[0] ||
          (node.arguments[0] && node.arguments[0].type === 'Identifier')
        ) {
          return;
        }

        const routeName = node.arguments[0].value;
        const hasAnyUppercaseLetter = Boolean(routeName.match('[A-Z]'));

        if (hasAnyUppercaseLetter) {
          report(node);
        }
      },
    };
  },
};
