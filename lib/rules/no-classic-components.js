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
      category: 'Best Practices',
      recommended: false,
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
