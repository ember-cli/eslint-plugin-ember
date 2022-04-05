'use strict';

const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = "Don't use Ember's array prototype extensions";

const EXTENSION_METHODS = new Set([
  /** EmberArray */
  'any',
  'compact',
  'filterBy',
  'findBy',
  'getEach',
  'invoke',
  'isAny',
  'isEvery',
  'mapBy',
  'objectAt',
  'objectsAt',
  'reject',
  'rejectBy',
  'setEach',
  'sortBy',
  'toArray',
  'uniq',
  'uniqBy',
  'without',
  /** MutableArray */
  'addObject',
  'addObjects',
  'clear',
  'insertAt',
  'popObject',
  'pushObject',
  'pushObjects',
  'removeAt',
  'removeObject',
  'removeObjects',
  'reverseObjects',
  'setObject',
  'shiftObject',
  'unshiftObject',
  'unshiftObjects',
]);

const EXTENSION_PROPERTIES = new Set(['lastObject', 'firstObject']);
//----------------------------------------------------------------------------------------------
// General rule - Don't use Ember's array prototype extensions like .any(), .pushObject() or .firstObject
//----------------------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow usage of Ember's `Array` prototype extensions",
      category: 'Deprecations',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-array-prototype-extensions.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let importedEmberName;

    return {
      CallExpression(node) {
        if (importedEmberName === 'A') {
          return;
        }

        const { callee } = node;

        if (callee.type !== 'MemberExpression') {
          return;
        }

        const { object, property } = callee;

        if (object.type === 'ThisExpression') {
          return;
        }

        if (property.type !== 'Identifier') {
          return;
        }

        if (EXTENSION_METHODS.has(property.name)) {
          context.report({ node: property, message: ERROR_MESSAGE });
        }
      },

      MemberExpression(node) {
        if (importedEmberName === 'A') {
          return;
        }
        const { property } = node;

        if (property.type !== 'Identifier') {
          return;
        }
        if (EXTENSION_PROPERTIES.has(property.name)) {
          context.report({ node: property, message: ERROR_MESSAGE });
        }
      },

      Literal(node) {
        // Generate regexp for extension properties.
        // new RegExp(`${[...EXTENSION_PROPERTIES].map(prop => `(\.|^)${prop}(\.|$)`).join('|')}`) won't generate \. correctly
        const regexp = /(\.|^)firstObject(\.|$)|(\.|^)lastObject(\.|$)/;
        const { value } = node;
        if (typeof value === 'string' && regexp.test(value)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },

      ImportDeclaration(node) {
        if (node.source.value === '@ember/array') {
          importedEmberName = importedEmberName || getImportIdentifier(node, '@ember/array', 'A');
        }
      },
    };
  },
};
