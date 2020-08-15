'use strict';

const types = require('../utils/types');
const computedPropertyUtils = require('../utils/computed-properties');
const propertySetterUtils = require('../utils/property-setter');
const emberUtils = require('../utils/ember');
const Traverser = require('../utils/traverser');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

// Ember.set(this, 'foo', 123)
function isEmberSetThis(node, importedEmberName) {
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isIdentifier(node.callee.object) &&
    node.callee.object.name === importedEmberName &&
    types.isIdentifier(node.callee.property) &&
    ['set', 'setProperties'].includes(node.callee.property.name) &&
    node.arguments.length > 0 &&
    memberExpressionBeginWithThis(node.arguments[0])
  );
}

// set(this, 'foo', 123)
function isImportedSetThis(node, importedSetName, importedSetPropertiesName) {
  return (
    types.isCallExpression(node) &&
    types.isIdentifier(node.callee) &&
    [importedSetName, importedSetPropertiesName].includes(node.callee.name) &&
    node.arguments.length > 0 &&
    memberExpressionBeginWithThis(node.arguments[0])
  );
}

// this.set('foo', 123)
// this.prop.set('foo', 123)
function isThisSet(node) {
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isIdentifier(node.callee.property) &&
    ['set', 'setProperties'].includes(node.callee.property.name) &&
    memberExpressionBeginWithThis(node.callee.object)
  );
}

function memberExpressionBeginWithThis(node) {
  if (types.isThisExpression(node)) {
    return true;
  } else if (types.isMemberExpression(node)) {
    return memberExpressionBeginWithThis(node.object);
  }
  return false;
}

/**
 * Recursively finds calls that could be side effects in a computed property function body.
 *
 * @param {ASTNode} computedPropertyBody body of computed property to search
 * @param {boolean} ignoreClosures
 * @param {string} importedEmberName
 * @param {string} importedSetName
 * @param {string} importedSetPropertiesName
 * @returns {Array<ASTNode>}
 */
function findSideEffects(
  computedPropertyBody,
  ignoreClosures,
  importedEmberName,
  importedSetName,
  importedSetPropertiesName
) {
  const results = [];

  let currentClosureNode = undefined;

  new Traverser().traverse(computedPropertyBody, {
    enter(child) {
      if (ignoreClosures && currentClosureNode) {
        return;
      } else if (types.isArrowFunctionExpression(child)) {
        currentClosureNode = child;
      }

      if (
        isEmberSetThis(child, importedEmberName) || // Ember.set(this, 'foo', 123)
        isImportedSetThis(child, importedSetName, importedSetPropertiesName) || // set(this, 'foo', 123)
        isThisSet(child) || // this.set('foo', 123)
        propertySetterUtils.isThisSet(child) // this.foo = 123;
      ) {
        results.push(child);
      }
    },

    leave(child) {
      if (child === currentClosureNode) {
        currentClosureNode = undefined;
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
    schema: [
      {
        type: 'object',
        properties: {
          ignoreClosures: {
            type: 'boolean',
            default: false,
          },
        },
      },
    ],
  },

  ERROR_MESSAGE,

  create(context) {
    // Options:
    const ignoreClosures = context.options[0] && context.options[0].ignoreClosures;

    let importedEmberName;
    let importedComputedName;
    let importedSetName;
    let importedSetPropertiesName;

    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
          importedSetName = importedSetName || getImportIdentifier(node, '@ember/object', 'set');
          importedSetPropertiesName =
            importedSetPropertiesName ||
            getImportIdentifier(node, '@ember/object', 'setProperties');
        }
      },

      CallExpression(node) {
        if (!emberUtils.isComputedProp(node, importedEmberName, importedComputedName)) {
          return;
        }

        const computedPropertyBody = computedPropertyUtils.getComputedPropertyFunctionBody(node);

        findSideEffects(
          computedPropertyBody,
          ignoreClosures,
          importedEmberName,
          importedSetName,
          importedSetPropertiesName
        ).forEach(report);
      },

      Identifier(node) {
        if (!emberUtils.isComputedProp(node, importedEmberName, importedComputedName)) {
          return;
        }

        const computedPropertyBody = computedPropertyUtils.getComputedPropertyFunctionBody(node);

        findSideEffects(
          computedPropertyBody,
          ignoreClosures,
          importedEmberName,
          importedSetName,
          importedSetPropertiesName
        ).forEach(report);
      },
    };
  },
};
