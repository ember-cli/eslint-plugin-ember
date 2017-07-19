'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

const ALIASES = ['$', 'jQuery'];
const MESSAGE = 'Do not use global `$` or `jQuery`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'No global jQuery',
      category: '',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    message: MESSAGE,
  },

  create(context) {
    let emberImportAliasName;
    let destructuredAssignment;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        emberImportAliasName = ember.getEmberImportAliasName(node);
      },

      VariableDeclarator(node) {
        if (emberImportAliasName) {
          destructuredAssignment = utils.collectObjectPatternBindings(node, {
            [emberImportAliasName]: ['$']
          }).pop();
        }
      },

      CallExpression(node) {
        if (utils.isGlobalCallExpression(node, destructuredAssignment, ALIASES)) {
          context.report(node, MESSAGE);
        }
      }
    };
  }
};
