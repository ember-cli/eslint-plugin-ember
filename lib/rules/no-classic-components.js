'use strict';

const ERROR_MESSAGE =
  'Use Glimmer components(@glimmer/component) instead of classic components(@ember/component)';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces Glimmer components',
      category: 'Ember Octane',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-classic-components.md',
    },
    fixable: null,
  },

  ERROR_MESSAGE,

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const report = function(node) {
      context.report(node, ERROR_MESSAGE);
    };

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource === '@ember/component') {
          report(node);
        }
      },
    };
  },
};
