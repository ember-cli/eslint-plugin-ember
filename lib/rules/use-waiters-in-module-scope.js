'use strict';

const { getImportIdentifier } = require('../utils/import');
const utils = require('../utils/utils');

const ERROR_MESSAGE = 'The buildWaiter function should be invoked in module scope.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require test waiters to be created in module scope',
      category: 'Testing',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/use-waiters-in-module-scope.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let buildWaiter;

    return {
      ImportDeclaration(node) {
        buildWaiter = getImportIdentifier(node, 'ember-test-waiters', 'buildWaiter');
      },

      CallExpression(node) {
        if (node.callee.name !== buildWaiter) {
          return;
        }

        const parentVariableDeclaration = utils.getParent(
          node,
          current => current.type === 'VariableDeclaration'
        );

        if (parentVariableDeclaration.parent.type !== 'Program') {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
