'use strict';

const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Use optional chaining operator `?.()` instead of `tryInvoke`';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow usage of the Ember's `tryInvoke` util",
      category: 'Ember Object',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-try-invoke.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    let importedTryInvokeName;

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource === '@ember/utils') {
          importedTryInvokeName =
            importedTryInvokeName || getImportIdentifier(node, '@ember/utils', 'tryInvoke');
        }
      },

      CallExpression(node) {
        if (types.isIdentifier(node.callee) && node.callee.name === importedTryInvokeName) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
