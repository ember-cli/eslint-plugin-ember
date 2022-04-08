'use strict';

const ERROR_MESSAGE = "Don't use Ember's array prototype extensions";

const EXTENSION_METHODS = new Set([
  /**
   * https://api.emberjs.com/ember/release/classes/EmberArray
   * EmberArray methods excluding native functions like reduce, filter etc.
   * */
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
  /**
   * https://api.emberjs.com/ember/release/classes/MutableArray
   * MutableArray methods excluding `replace` since it's part of string native functions
   * */
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

/**
 * https://api.emberjs.com/ember/release/classes/EmberArray
 * EmberArray properties excluding native props: [], length.
 * */
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
    messages: {
      main: ERROR_MESSAGE,
    },
  },

  create(context) {
    return {
      /**
       * Cover cases when `EXTENSION_METHODS` is getting called.
       * Example: something.filterBy();
       * @param {Object} node
       */
      CallExpression(node) {
        // Skip case: filterBy();
        if (node.callee.type !== 'MemberExpression') {
          return;
        }

        // Skip case: this.filterBy();
        if (node.callee.object.type === 'ThisExpression') {
          return;
        }

        if (node.callee.property.type !== 'Identifier') {
          return;
        }

        if (EXTENSION_METHODS.has(node.callee.property.name)) {
          context.report({ node, messageId: 'main' });
        }
      },

      /**
       * Cover cases when `EXTENSION_PROPERTIES` is accessed like:
       * foo.firstObject;
       * bar.lastObject.bar;
       * @param {Object} node
       */
      MemberExpression(node) {
        // Skip case when EXTENSION_PROPERTIES is accessed through callee.
        // Example: something.firstObject()
        if (node.parent.type === 'CallExpression') {
          return;
        }

        if (node.property.type !== 'Identifier') {
          return;
        }
        if (EXTENSION_PROPERTIES.has(node.property.name)) {
          context.report({ node, messageId: 'main' });
        }
      },

      /**
       * Cover cases when `EXTENSION_PROPERTIES` is accessed through literals like:
       * get(something, 'foo.firstObject');
       * set(something, 'lastObject.bar', 'something');
       * @param {Object} node
       */
      Literal(node) {
        // Generate regexp for extension properties.
        // new RegExp(`${[...EXTENSION_PROPERTIES].map(prop => `(\.|^)${prop}(\.|$)`).join('|')}`) won't generate \. correctly
        const regexp = /(\.|^)firstObject(\.|$)|(\.|^)lastObject(\.|$)/;

        if (typeof node.value === 'string' && regexp.test(node.value)) {
          context.report({ node, messageId: 'main' });
        }
      },
    };
  },
};
