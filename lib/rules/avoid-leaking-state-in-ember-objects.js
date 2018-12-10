'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

let emberImportAliasName;

const DEFAULT_IGNORED_PROPERTIES = [
  'classNames',
  'classNameBindings',
  'actions',
  'concatenatedProperties',
  'mergedProperties',
  'positionalParams',
  'attributeBindings',
  'queryParams',
  'attrs',
];

const isEmberObjectCall = function (value) {
  const callee = value.callee;

  const isEmberObject = (utils.isMemberExpression(callee) &&
    utils.isIdentifier(callee.object) && (callee.object.name === 'Ember' || callee.object.name === emberImportAliasName) &&
    utils.isIdentifier(callee.property) && callee.property.name === 'Object');

  const isEmberObjectCreate = (utils.isMemberExpression(callee) &&
    utils.isIdentifier(callee.object) && callee.object.name === 'EmberObject' &&
    utils.isIdentifier(callee.property) && callee.property.name === 'create');

  return callee.name === 'Object' ||
    callee.name === 'EmberObject' ||
    isEmberObject ||
    isEmberObjectCreate;
};

const isEmberArrayCall = function (value) {
  const callee = value.callee;
  return (callee.name === 'A') ||
    (utils.isMemberExpression(callee) &&
    utils.isIdentifier(callee.object) && (callee.object.name === 'Ember' || callee.object.name === emberImportAliasName) &&
    utils.isIdentifier(callee.property) && callee.property.name === 'A');
};

const isAllowed = function (property) {
  const value = property.value;

  return ember.isFunctionExpression(value) ||
    utils.isLiteral(value) ||
    utils.isIdentifier(value) ||
    (utils.isCallExpression(value) && !isEmberArrayCall(value) && !isEmberObjectCall(value)) ||
    utils.isBinaryExpression(value) ||
    utils.isTemplateLiteral(value) ||
    utils.isTaggedTemplateExpression(value) ||
    utils.isMemberExpression(value) ||
    utils.isUnaryExpression(value);
};

//------------------------------------------------------------------------------
// Ember object rule - Avoid leaking state
// (Don't use arrays or objects as default props)
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Avoids state leakage',
      category: 'Ember Object',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/avoid-leaking-state-in-ember-objects.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [{
      type: 'array',
      items: { type: 'string' },
    }],
  },

  DEFAULT_IGNORED_PROPERTIES,

  create(context) {
    const ignoredProperties = context.options[0] || DEFAULT_IGNORED_PROPERTIES;

    const report = function (node) {
      const message = 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties';
      context.report(node, message);
    };

    return {
      ImportDeclaration(node) {
        if (!emberImportAliasName) {
          emberImportAliasName = ember.getEmberImportAliasName(node);
        }
      },

      CallExpression(node) {
        if (!(ember.isEmberObject(node) || ember.isReopenObject(node))) return;

        const properties = ember.getModuleProperties(node);

        properties
          .filter(property => ignoredProperties.indexOf(property.key.name) === -1)
          .forEach((property) => {
            if (!isAllowed(property)) {
              report(property);
            }
          });
      },
    };
  },
};
