'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const computedPropertyUtils = require('../utils/computed-properties');
const propertySetterUtils = require('../utils/property-setter');
const emberUtils = require('../utils/ember');
const Traverser = require('../utils/traverser');

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

function isUnallowedMethod(name) {
  return ['set', 'setProperties'].includes(name);
}

function isEmberSet(node, emberImportAliasName) {
  const callee = node.callee;
  return (
    (types.isIdentifier(callee) && isUnallowedMethod(callee.name)) ||
    (types.isMemberExpression(callee) &&
      (types.isThisExpression(callee.object) ||
        callee.object.name === 'Ember' ||
        callee.object.name === emberImportAliasName) &&
      types.isIdentifier(callee.property) &&
      isUnallowedMethod(callee.property.name))
  );
}

/**
 * Recursively finds calls that could be side effects in a computed property function body.
 *
 * @param {ASTNode} computedPropertyBody body of computed property to search
 * @param {string} emberImportAliasName
 * @returns {Array<ASTNode>}
 */
function findSideEffects(computedPropertyBody, emberImportAliasName) {
  const results = [];

  new Traverser().traverse(computedPropertyBody, {
    enter(child) {
      if (isEmberSet(child, emberImportAliasName) || propertySetterUtils.isThisSet(child)) {
        results.push(child);
      }
    },
  });

  return results;
}

const ERROR_MESSAGE = "Don't introduce side-effects in computed properties";

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unexpected side effects in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-side-effects.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let emberImportAliasName;

    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    return {
      ImportDeclaration(node) {
        if (!emberImportAliasName) {
          emberImportAliasName = ember.getEmberImportAliasName(node);
        }
      },

      CallExpression(node) {
        if (!emberUtils.isComputedProp(node)) {
          return;
        }

        const computedPropertyBody = computedPropertyUtils.getComputedPropertyFunctionBody(node);

        findSideEffects(computedPropertyBody, emberImportAliasName).forEach(report);
      },

      Identifier(node) {
        if (!emberUtils.isComputedProp(node)) {
          return;
        }

        const computedPropertyBody = computedPropertyUtils.getComputedPropertyFunctionBody(node);

        findSideEffects(computedPropertyBody, emberImportAliasName).forEach(report);
      },
    };
  },
};
