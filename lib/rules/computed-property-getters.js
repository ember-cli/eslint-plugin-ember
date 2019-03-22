'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule - Prevent using a getter inside computed properties.
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Warns about getters in computed properties',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/computed-property-getters.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        enum: ['always', 'never']
      },
    ],
  },

  create(context) {
    const requireGetters = context.options[0] || 'never';
    const message = 'Do not use a getter inside computed properties.';

    const report = function (node) {
      context.report(node, message);
    };

    const preventGetterInComputedProperty = function (node) {
      const objectExpressions = node.arguments.filter(arg => utils.isObjectExpression(arg));
      if (
        objectExpressions.length
      ) {
        report(node);
      }
    };

    const requireGetterInComputedProperty = function (node) {
      const functionExpressions = node.arguments.filter(arg => utils.isFunctionExpression(arg));
      if (
        functionExpressions.length
      ) {
        report(node);
      }
    };

    return {
      CallExpression(node) {
        if (
          ember.isComputedProp(node) &&
          node.arguments.length
        ) {
          if (requireGetters === 'always') {
            requireGetterInComputedProperty(node);
          } else {
            preventGetterInComputedProperty(node);
          }
        }
      }
    };
  }
};
