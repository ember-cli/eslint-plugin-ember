'use strict';

const ERROR_MESSAGE = 'Use currentURL() instead of currentRouteName()';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of the `currentRouteName()` test helper',
      category: 'Testing',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-current-route-name.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const importAliases = [];

    return {
      ImportSpecifier(node) {
        const { imported, local } = node;
        if (
          imported.type === 'Identifier' &&
          imported.name === 'currentRouteName' &&
          local.type === 'Identifier'
        ) {
          importAliases.push(local.name);
        }
      },

      CallExpression(node) {
        const { callee } = node;
        if (callee.type === 'Identifier' && importAliases.includes(callee.name)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
