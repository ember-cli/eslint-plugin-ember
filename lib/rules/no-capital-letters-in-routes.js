'use strict';

const ember = require('../utils/ember');
//------------------------------------------------------------------------------
// Routing - No capital letters in routes
//------------------------------------------------------------------------------

const PATTERN = /^[A-Z]{1}/;

module.exports = {
  meta: {
    docs: {
      description: 'Raise an error if a route name begin with an uppercased letter in router.js',
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
        if (!ember.isRoute(node) || !node.arguments[0]) return;

        const routeName = node.arguments[0].value;

        if (PATTERN.test(routeName)) {
          report(node);
        }
      },
    };
  },
};
