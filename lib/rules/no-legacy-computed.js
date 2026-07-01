'use strict';

const ERROR_MESSAGE =
  "Don't use legacy computed properties or computed macros. Prefer `@tracked` and native getters.";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of legacy computed properties and computed macros',
      category: 'Computed Properties',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-legacy-computed.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object/computed') {
          if (node.specifiers.length === 0) {
            context.report({ node, message: ERROR_MESSAGE });
            return;
          }

          for (const specifier of node.specifiers) {
            context.report({ node: specifier, message: ERROR_MESSAGE });
          }
        }

        if (node.source.value === '@ember/object') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'computed') {
              context.report({ node: specifier, message: ERROR_MESSAGE });
            }
          }
        }
      },
    };
  },
};
