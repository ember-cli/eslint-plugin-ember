'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

function isUnallowedMethod(name) {
  return ['set', 'setProperties'].includes(name);
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unexpected side effects in computed properties',
      category: 'Possible Errors',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-side-effects.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    let emberImportAliasName;

    const message = "Don't introduce side-effects in computed properties";

    const report = function(node) {
      context.report(node, message);
    };

    return {
      ImportDeclaration(node) {
        if (!emberImportAliasName) {
          emberImportAliasName = ember.getEmberImportAliasName(node);
        }
      },

      CallExpression(node) {
        const callee = node.callee;
        const isEmberSet =
          (types.isIdentifier(callee) && isUnallowedMethod(callee.name)) ||
          (types.isMemberExpression(callee) &&
            (types.isThisExpression(callee.object) ||
              callee.object.name === 'Ember' ||
              callee.object.name === emberImportAliasName) &&
            types.isIdentifier(callee.property) &&
            isUnallowedMethod(callee.property.name));

        if (isEmberSet) {
          const ancestors = context.getAncestors();
          const computedIndex = ancestors.findIndex(ember.isComputedProp);
          const setPropertyFunctionIndex = ancestors.findIndex(
            ancestor =>
              ancestor.type === 'Property' &&
              ancestor.key.name === 'set' &&
              types.isFunctionExpression(ancestor.value)
          );

          if (
            computedIndex > -1 &&
            (setPropertyFunctionIndex === -1 || setPropertyFunctionIndex < computedIndex)
          ) {
            report(node);
          }
        }
      },
    };
  },
};
