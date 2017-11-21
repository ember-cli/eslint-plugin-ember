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
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,  // or "code" or "whitespace"
    message: MESSAGE,
  },

  create(context) {
    let destructuredAssignment;
    let importAliasName;

    return {
      ImportDeclaration(node) {
        // Capture whether the jquery module is being imported.
        if (node.source.value === 'jquery') {
          importAliasName = 'jquery';
        } else {
          importAliasName = ember.getEmberImportAliasName(node);
        }
      },

      VariableDeclarator(node) {
        if (importAliasName) {
          if (node.init && utils.isMemberExpression(node.init)) {
            // assignment of type const $ = Ember.$;
            destructuredAssignment = node.id.name;
          } else {
            destructuredAssignment = utils.collectObjectPatternBindings(node, {
              [importAliasName]: ['$']
            }).pop();
          }
        }
      },

      CallExpression(node) {
        // In the event in which the jQuery module is being imported
        // using the new modules import syntax do not report to ESLint
        if (importAliasName === 'jquery') return;

        if (utils.isGlobalCallExpression(node, destructuredAssignment, ALIASES)) {
          context.report(node, MESSAGE);
        }
      }
    };
  }
};
