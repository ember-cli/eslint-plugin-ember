'use strict';

const { getImportIdentifier } = require('../utils/import');
const utils = require('../utils/utils');

const MODULE_SCOPE_ERROR_MESSAGE = 'The buildWaiter function should be invoked in module scope.';
const DIRECT_ASSIGNMENT_ERROR_MESSAGE =
  'The result of the `buildWaiter` function must be a direct assignment to a module scoped variable';

function isInModuleScope(node) {
  const ancestorVariableDeclaration = utils.getAncestor(
    node,
    (ancestor) => ancestor.type === 'VariableDeclaration'
  );

  return ancestorVariableDeclaration.parent.type === 'Program';
}

function isDirectVariableDeclaration(node) {
  return node.parent.type === 'VariableDeclarator';
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow incorrect usage of test waiter APIs',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-invalid-test-waiters.md',
    },
    fixable: null,
    schema: [],
  },

  MODULE_SCOPE_ERROR_MESSAGE,
  DIRECT_ASSIGNMENT_ERROR_MESSAGE,

  create(context) {
    let buildWaiter;

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember-test-waiters') {
          buildWaiter =
            buildWaiter || getImportIdentifier(node, 'ember-test-waiters', 'buildWaiter');
        }
      },

      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== buildWaiter) {
          return;
        }

        if (!isDirectVariableDeclaration(node)) {
          context.report({
            node,
            message: DIRECT_ASSIGNMENT_ERROR_MESSAGE,
          });
        } else if (!isInModuleScope(node)) {
          context.report({
            node,
            message: MODULE_SCOPE_ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
