'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

const DISALLOWED_METHODS = ['set', 'get', 'setProperties', 'getProperties'];
const DISALLOWED_METHOD_SET = new Set(DISALLOWED_METHODS);

function makeThisErrorMessage(methodName) {
  return `Do not use \`this.${methodName}()\` in gjs/gts tests. Use tracked state or local variables in the test \`<template>\` instead.`;
}

function makeImportedErrorMessage(methodName) {
  return `Do not use \`${methodName}()\` from \`@ember/object\` in gjs/gts tests. Use tracked state or local variables in the test \`<template>\` instead.`;
}

function isGjsOrGtsTestFile(fileName) {
  return (
    emberUtils.isTestFile(fileName) && (fileName.endsWith('.gjs') || fileName.endsWith('.gts'))
  );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow usage of `this.set`, `this.get`, `this.setProperties`, and `this.getProperties` in `.gjs`/`.gts` tests',
      category: 'Testing',
      recommended: false,
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-this-set-get.md',
    },
    fixable: null,
    schema: [],
  },

  makeErrorMessage: makeThisErrorMessage,
  makeThisErrorMessage,
  makeImportedErrorMessage,

  create(context) {
    if (!isGjsOrGtsTestFile(context.filename)) {
      return {};
    }

    // Map from local identifier name -> the original `@ember/object` export name.
    const importedNames = new Map();

    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@ember/object') {
          return;
        }
        for (const original of DISALLOWED_METHODS) {
          const localName = getImportIdentifier(node, '@ember/object', original);
          if (localName) {
            importedNames.set(localName, original);
          }
        }
      },

      CallExpression(node) {
        const { callee } = node;

        // Flag `this.set(...)`, `this.get(...)`, etc., including the computed
        // form `this["set"](...)`.
        if (callee.type === 'MemberExpression' && types.isThisExpression(callee.object)) {
          let propertyName;
          if (!callee.computed && types.isIdentifier(callee.property)) {
            propertyName = callee.property.name;
          } else if (callee.computed && types.isStringLiteral(callee.property)) {
            propertyName = callee.property.value;
          }
          if (propertyName && DISALLOWED_METHOD_SET.has(propertyName)) {
            context.report({
              node,
              message: makeThisErrorMessage(propertyName),
            });
            return;
          }
        }

        // Flag calls to `set`/`get`/`setProperties`/`getProperties` when
        // imported from `@ember/object`.
        if (types.isIdentifier(callee) && importedNames.has(callee.name)) {
          context.report({
            node,
            message: makeImportedErrorMessage(importedNames.get(callee.name)),
          });
        }
      },
    };
  },
};
