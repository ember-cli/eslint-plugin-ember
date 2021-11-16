'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// General rule - Prevent using a getter inside computed properties.
//------------------------------------------------------------------------------

const ALWAYS_GETTER_MESSAGE = 'Always use a getter inside computed properties.';
const PREVENT_GETTER_MESSAGE = 'Do not use a getter inside computed properties.';
const ALWAYS_WITH_SETTER_MESSAGE =
  'Always define a getter inside computed properties when using a setter.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce the consistent use of getters in computed properties',
      category: 'Computed Properties',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/computed-property-getters.md',
    },
    fixable: null,
    schema: [
      {
        enum: ['always-with-setter', 'always', 'never'],
      },
    ],
  },

  ALWAYS_GETTER_MESSAGE,
  PREVENT_GETTER_MESSAGE,
  ALWAYS_WITH_SETTER_MESSAGE,

  create(context) {
    const requireGetters = context.options[0] || 'always-with-setter';

    const report = function (node, message) {
      context.report({ node, message });
    };

    const requireGetterOnlyWithASetterInComputedProperty = function (node) {
      const objectExpressions = node.arguments.filter((arg) => types.isObjectExpression(arg));
      if (objectExpressions.length > 0) {
        const { properties } = objectExpressions[0];
        const getters = properties.filter(
          (prop) => prop.key && prop.key.name && prop.key.name === 'get'
        );
        const setters = properties.filter(
          (prop) => prop.key && prop.key.name && prop.key.name === 'set'
        );
        if (
          (setters.length > 0 && getters.length === 0) ||
          (getters.length > 0 && setters.length === 0)
        ) {
          report(node, ALWAYS_WITH_SETTER_MESSAGE);
        }
      }
    };

    const preventGetterInComputedProperty = function (node) {
      const objectExpressions = node.arguments.filter((arg) => types.isObjectExpression(arg));
      if (objectExpressions.length > 0) {
        const { properties } = objectExpressions[0];
        const getters = properties.filter(
          (prop) => prop.key && prop.key.name && prop.key.name === 'get'
        );
        const setters = properties.filter(
          (prop) => prop.key && prop.key.name && prop.key.name === 'set'
        );
        if (getters.length > 0 || setters.length > 0) {
          report(node, PREVENT_GETTER_MESSAGE);
        }
      }
    };

    const requireGetterInComputedProperty = function (node) {
      const objectExpressions = node.arguments.filter((arg) => types.isObjectExpression(arg));
      const functionExpressions = node.arguments.filter((arg) => types.isFunctionExpression(arg));

      if (objectExpressions.length > 0) {
        const { properties } = objectExpressions[0];

        const getters = properties.filter(
          (prop) => prop.key && prop.key.name && prop.key.name === 'get'
        );
        if (getters.length === 0) {
          report(node, ALWAYS_GETTER_MESSAGE);
        }
      } else if (functionExpressions.length > 0) {
        report(node, ALWAYS_GETTER_MESSAGE);
      }
    };

    let importedEmberName;
    let importedComputedName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
        }
      },

      CallExpression(node) {
        if (
          ember.isComputedProp(node, importedEmberName, importedComputedName) &&
          node.arguments.length > 0
        ) {
          if (requireGetters === 'always-with-setter') {
            requireGetterOnlyWithASetterInComputedProperty(node);
          }
          if (requireGetters === 'always') {
            requireGetterInComputedProperty(node);
          }
          if (requireGetters === 'never') {
            preventGetterInComputedProperty(node);
          }
        }
      },
    };
  },
};
