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
      description: 'Prevents usage of global jQuery object',
      category: 'General',
      recommended: true,
    },
    fixable: null,  // or "code" or "whitespace"
    message: MESSAGE,
  },

  create(context) {
    let emberImportAliasName;
    let destructuredAssignment;

    return {
      ImportDeclaration(node) {
        emberImportAliasName = ember.getEmberImportAliasName(node);
      },

      VariableDeclarator(node) {
        if (emberImportAliasName) {
          if (utils.isMemberExpression(node.init)) {
            // assignment of type const $ = Ember.$;
            destructuredAssignment = node.id.name;
          } else {
            destructuredAssignment = utils.collectObjectPatternBindings(node, {
              [emberImportAliasName]: ['$']
            }).pop();
          }
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
