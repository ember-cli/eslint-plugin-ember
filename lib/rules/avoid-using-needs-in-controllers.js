'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Ember object rule - Avoid using needs in controllers
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using `needs` in controllers',
      category: 'Controllers',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/avoid-using-needs-in-controllers.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const report = function (node) {
      const message =
        '`needs` API has been deprecated, `Ember.inject.controller` should be used instead';
      context.report({ node, message });
    };

    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    return {
      CallExpression(node) {
        const isReopenNode = ember.isReopenObject(node) || ember.isReopenClassObject(node);

        if (!ember.isEmberController(context, node) && !isReopenNode) {
          return;
        }

        const properties = ember.getModuleProperties(node, scopeManager);

        for (const property of properties) {
          if (
            property.type === 'Property' &&
            property.key.type === 'Identifier' &&
            property.key.name === 'needs'
          ) {
            report(property);
          }
        }
      },
    };
  },
};
