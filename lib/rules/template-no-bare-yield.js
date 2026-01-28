/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{yield}} without parameters outside of contextual components',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-bare-yield.md',
    },
    schema: [],
    messages: {
      noBareYield: 'yield should have parameters or be used in contextual components only.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'yield' &&
          (!node.params || node.params.length === 0)
        ) {
          context.report({
            node,
            messageId: 'noBareYield',
          });
        }
      },
    };
  },
};
