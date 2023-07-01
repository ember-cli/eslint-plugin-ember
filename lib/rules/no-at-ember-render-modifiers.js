'use strict';

const error = 'Do not use @ember/render-modifiers.';
const help =
  'Instead, use derived data patterns, and/or co-locate destruction via @ember/destroyable';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow importing from @ember/render-modifiers',
      category: 'Miscellaneous',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-render-modifiers.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.startsWith('@ember/render-modifiers')) {
          context.report({
            node,
            message: '{{error}} {{help}}',
            data: {
              error,
              help,
            },
          });
        }
      },
    };
  },
};
