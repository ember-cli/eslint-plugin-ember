'use strict';

const types = require('../utils/types');
const computedPropertyUtils = require('../utils/computed-properties');
const propertySetterUtils = require('../utils/property-setter');
const emberUtils = require('../utils/ember');
const estraverse = require('estraverse');
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
    memberExpressionBeginsWithThis(node.arguments[0])
  );
}

// set(this, 'foo', 123)
function isImportedSetThis(node, importedSetName, importedSetPropertiesName) {
  return (
    types.isCallExpression(node) &&
    types.isIdentifier(node.callee) &&
    [importedSetName, importedSetPropertiesName].includes(node.callee.name) &&
    node.arguments.length > 0 &&
    memberExpressionBeginsWithThis(node.arguments[0])
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
    memberExpressionBeginsWithThis(node.callee.object)
  );
}

// import { sendEvent } from "@ember/object/events"
// Ember.sendEvent

// Looks for variations like:
// - this.send(...)
// - Ember.send(...)
const DISALLOWED_FUNCTION_CALLS = new Set(['send', 'sendAction', 'sendEvent', 'trigger']);
function isDisallowedFunctionCall(node, importedEmberName) {
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    (types.isThisExpression(node.callee.object) ||
      (types.isIdentifier(node.callee.object) && node.callee.object.name === importedEmberName)) &&
    types.isIdentifier(node.callee.property) &&
    DISALLOWED_FUNCTION_CALLS.has(node.callee.property.name)
  );
}

// sendEvent(...)
function isImportedSendEventCall(node, importedSendEventName) {
  return (
    types.isCallExpression(node) &&
    types.isIdentifier(node.callee) &&
    node.callee.name === importedSendEventName
  );
}

/**
 * Finds:
 * - this
 * - this.foo
 * - this.foo.bar
 * - this?.foo?.bar
 * @param {node} node
 */
function memberExpressionBeginsWithThis(node) {
  if (types.isThisExpression(node)) {
    return true;
  } else if (types.isMemberExpression(node) || types.isOptionalMemberExpression(node)) {
    return memberExpressionBeginsWithThis(node.object);
  } else if (node.type === 'ChainExpression') {
    return memberExpressionBeginsWithThis(node.expression);
  }
  return false;
}

/**
 * Recursively finds calls that could be side effects in a computed property function body.
 *
 * @param {ASTNode} computedPropertyBody body of computed property to search
 * @param {boolean} catchEvents
 * @param {string} importedEmberName
 * @param {string} importedSetName
 * @param {string} importedSetPropertiesName
 * @param {string} importedSendEventName
 * @returns {Array<ASTNode>}
 */
function findSideEffects(
  computedPropertyBody,
  catchEvents,
  importedEmberName,
  importedSetName,
  importedSetPropertiesName,
  importedSendEventName
) {
  const results = [];

  estraverse.traverse(computedPropertyBody, {
    enter(child) {
      if (
        isEmberSetThis(child, importedEmberName) || // Ember.set(this, 'foo', 123)
        isImportedSetThis(child, importedSetName, importedSetPropertiesName) || // set(this, 'foo', 123)
        isThisSet(child) || // this.set('foo', 123)
        propertySetterUtils.isThisSet(child) || // this.foo = 123;
        (catchEvents && isDisallowedFunctionCall(child, importedEmberName)) || // this.send('done')
        (catchEvents && isImportedSendEventCall(child, importedSendEventName)) // sendEvent(...)
      ) {
        results.push(child);
      }
    },
    fallback: 'iteration',
  });

  return results;
}

const ERROR_MESSAGE = "Don't introduce side-effects in computed properties";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unexpected side effects in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-side-effects.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          catchEvents: {
            type: 'boolean',
            default: true,
            description:
              'Whether the rule should catch function calls that send actions or events.',
          },
          checkPlainGetters: {
            type: 'boolean',
            default: true,
            description:
              'Whether the rule should check plain (non-computed) getters in native classes for side effects.',
          },
        },
      },
    ],
  },

  ERROR_MESSAGE,

  create(context) {
    // Options:
    const catchEvents = context.options[0] ? context.options[0].catchEvents : true;
    const checkPlainGetters = !context.options[0] || context.options[0].checkPlainGetters;

    let importedEmberName;
    let importedComputedName;
    let importedSetName;
    let importedSetPropertiesName;
    let importedSendEventName;

    let currentEmberClass;

    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
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
        if (node.source.value === '@ember/object/events') {
          importedSendEventName =
            importedSendEventName || getImportIdentifier(node, '@ember/object/events', 'sendEvent');
        }
      },

      MethodDefinition(node) {
        if (
          !checkPlainGetters ||
          !currentEmberClass ||
          node.kind !== 'get' ||
          !types.isFunctionExpression(node.value)
        ) {
          return;
        }

        for (const sideEffect of findSideEffects(
          node.value,
          catchEvents,
          importedEmberName,
          importedSetName,
          importedSetPropertiesName,
          importedSendEventName
        )) {
          report(sideEffect);
        }
      },

      ClassDeclaration(node) {
        if (emberUtils.isAnyEmberCoreModule(context, node)) {
          currentEmberClass = node;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (currentEmberClass === node) {
          currentEmberClass = null;
        }
      },

      CallExpression(node) {
        if (
          (checkPlainGetters && currentEmberClass) ||
          !emberUtils.isComputedProp(node, importedEmberName, importedComputedName)
        ) {
          return;
        }

        const computedPropertyBody = computedPropertyUtils.getComputedPropertyFunctionBody(node);

        for (const sideEffect of findSideEffects(
          computedPropertyBody,
          catchEvents,
          importedEmberName,
          importedSetName,
          importedSetPropertiesName,
          importedSendEventName
        )) {
          report(sideEffect);
        }
      },

      Identifier(node) {
        if (
          (checkPlainGetters && currentEmberClass) ||
          !emberUtils.isComputedProp(node, importedEmberName, importedComputedName)
        ) {
          return;
        }

        const computedPropertyBody = computedPropertyUtils.getComputedPropertyFunctionBody(node);

        for (const sideEffect of findSideEffects(
          computedPropertyBody,
          catchEvents,
          importedEmberName,
          importedSetName,
          importedSetPropertiesName,
          importedSendEventName
        )) {
          report(sideEffect);
        }
      },
    };
  },
};
