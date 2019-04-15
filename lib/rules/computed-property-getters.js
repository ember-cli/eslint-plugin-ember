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
        enum: ['always-with-setter', 'always', 'never']
      },
    ],
  },

  create(context) {
    const requireGetters = context.options[0] || 'always-with-setter';
    const message = 'Do not use a getter inside computed properties.';

    const report = function (node) {
      context.report(node, message);
    };

    const requireGetterWithSetterInComputedProperty = function (node) {
      const objectExpressions = node.arguments.filter(arg => utils.isObjectExpression(arg));
      if (
        objectExpressions.length
      ) {
        const { properties } = objectExpressions[0];
        const getters = properties.filter(prop => prop.key && prop.key.name && prop.key.name === 'get');
        const setters = properties.filter(prop => prop.key && prop.key.name && prop.key.name === 'set');
        if (
          setters.length === 0 ||
          (setters.length > 0 && getters.length === 0)
        ) {
          report(node);
        }
      }
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
          if (requireGetters === 'always-with-setter') {
            requireGetterWithSetterInComputedProperty(node);
          }
          if (requireGetters === 'always') {
            requireGetterInComputedProperty(node);
          }
          if (requireGetters === 'never') {
            preventGetterInComputedProperty(node);
          }
        }
      }
    };
  }
};
