'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule -  Disallow usage of jQuery
//------------------------------------------------------------------------------

const message = 'Do not use jQuery';
const specialisedMessageForThisJquery = 'Do not use `this.$` in components or tests, as it uses jQuery underneath.';
const ALIASES = ['$', 'jQuery'];

function isThisJquery(node) {
  return utils.isMemberExpression(node.callee) &&
    utils.isThisExpression(node.callee.object) &&
    node.callee.property.name === '$';
}

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of `this.$` on components or tests',
      category: 'Components & tests',
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    message
  },
  create(context) {
    let destructuredAssignment;
    let emberImportAliasName;
    const report = function (node) {
      context.report(node, message);
    };

    return {
      ImportDeclaration(node) {
        emberImportAliasName = ember.getEmberImportAliasName(node);
      },

      VariableDeclarator(node) {
        if (emberImportAliasName) {
          if (node.init && utils.isMemberExpression(node.init)) {
            // assignment of type const $ = Ember.$;
            destructuredAssignment = node.id.name;
          } else {
            destructuredAssignment = utils.collectObjectPatternBindings(node, {
              [emberImportAliasName]: ['$']
            }).pop();
          }
        }
      },

      MemberExpression(node) {
        if ((node.object.name === 'Ember' || node.object.name === 'Em' || (emberImportAliasName && node.object.name === emberImportAliasName)) && node.property.name === '$') {
          report(node, message);
        }
      },

      CallExpression(node) {
        if (utils.isGlobalCallExpression(node, destructuredAssignment, ALIASES)) {
          context.report(node, message);
        }

        if (isThisJquery(node)) {
          report(node, specialisedMessageForThisJquery);
        }
      }
    };
  }
};
