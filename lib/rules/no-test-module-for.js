'use strict';

const assert = require('assert');

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

const ERROR_MESSAGE = 'moduleFor* apis are are not allowed. Use `module` instead of `moduleFor`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of `moduleFor`, `moduleForComponent`, etc',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-module-for.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const filename = context.getFilename();
    const isTestFile =
      emberUtils.isTestFile(filename) ||
      (filename.includes('tests') && filename.includes('helpers'));

    if (!isTestFile) {
      return {};
    }

    return {
      FunctionDeclaration(node) {
        if (isModuleFor(context, node)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
      CallExpression(node) {
        if (isModuleFor(context, node)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};

function isModuleFor(_context, node) {
  assert(types.isCallExpression(node) || types.isFunctionDeclaration(node));

  const { callee, id } = node;
  const identifier = callee || id;

  if (!identifier || !types.isIdentifier(identifier)) {
    return false;
  }

  // catches everything from legacy ember-qunit
  //  - moduleForComponent
  //  - moduleForModel
  //  - moduleFor
  //
  // this lint will error on the definition of moduleForAcceptance, likely in
  // tests/helpers/start-app.js
  // moduleForAcceptance was the default name from the ember blueprint
  //
  // in case someone renames a moduleFor to something else like,
  // - moduleForUtil
  // - moduleForRoute
  // the entire pattern is not allowed.
  const isBespokeInvocation = identifier.name.startsWith('moduleFor');

  return isBespokeInvocation;
}
