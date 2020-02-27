'use strict';
const { getImportIdentifiers } = require('../utils/import');

const LEGACY_TEST_WAITER_FUNCTIONS = ['registerWaiter', 'unregisterWaiter'];
const ERROR_MESSAGE =
  'The use of the legacy test waiters API is not allowed. Please use the new ember-test-waiters (https://github.com/emberjs/ember-test-waiters) APIs instead.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of the legacy test waiter APIs.',
      category: 'Testing',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-legacy-test-waiters.md',
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

        testWaitersIdentifiers = testWaitersIdentifiers.concat(
          getImportIdentifiers(node, {
            '@ember/test': LEGACY_TEST_WAITER_FUNCTIONS,
          })
        );

        if (testWaitersIdentifiers.length > 0) {
          context.report(node, ERROR_MESSAGE);
        }
      },

      CallExpression(node) {
        if (
          testWaitersIdentifiers.length > 0 &&
          testWaitersIdentifiers.includes(node.callee.name)
        ) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
