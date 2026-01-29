/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of (mut) helper',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-mut-helper.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noMutHelper: 'Do not use the (mut) helper. Use regular setters or actions instead.',
    },
  },

  create(context) {
    return {
      GlimmerSubExpression(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'mut'
        ) {
          context.report({
            node,
            messageId: 'noMutHelper',
          });
        }
      },
    };
  },
};
