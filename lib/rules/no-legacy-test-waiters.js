'use strict';
const { getImportIdentifier } = require('../utils/import');

const LEGACY_TEST_WAITER_FUNCTIONS = ['registerWaiter', 'unregisterWaiter'];
const ERROR_MESSAGE =
  'The use of the legacy test waiters API is not allowed. Please use the new ember-test-waiters (https://github.com/emberjs/ember-test-waiters) APIs instead.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of the legacy test waiter APIs',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-legacy-test-waiters.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let testWaitersIdentifiers = [];

    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@ember/test') {
          return;
        }

        testWaitersIdentifiers = LEGACY_TEST_WAITER_FUNCTIONS.map((fn) =>
          getImportIdentifier(node, '@ember/test', fn)
        );
      },

      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          testWaitersIdentifiers.includes(node.callee.name)
        ) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
