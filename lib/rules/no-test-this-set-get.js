'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');

const DISALLOWED_METHODS = new Set(['set', 'get', 'setProperties', 'getProperties']);

function makeErrorMessage(methodName) {
  return `Do not use \`this.${methodName}()\` in gjs/gts tests. Use tracked state or local variables in the test \`<template>\` instead.`;
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

  makeErrorMessage,

  create(context) {
    if (!isGjsOrGtsTestFile(context.filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          types.isThisExpression(callee.object) &&
          types.isIdentifier(callee.property) &&
          DISALLOWED_METHODS.has(callee.property.name)
        ) {
          context.report({
            node,
            message: makeErrorMessage(callee.property.name),
          });
        }
      },
    };
  },
};
