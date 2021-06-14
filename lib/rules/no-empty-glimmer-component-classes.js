'use strict';

const { isGlimmerComponent } = require('../utils/ember');

const ERROR_MESSAGE = 'Do not create empty backing classes for Glimmer components.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty backing classes for Glimmer components',
      category: 'Ember Octane',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-empty-glimmer-component-classes.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      ClassDeclaration(node) {
        if (isGlimmerComponent(context, node) && node.body.body.length === 0) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
