/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow chained property access on this',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-chained-this.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noChainedThis:
        'Do not chain property access on this ({{path}}). Use local variables or getters instead.',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        // Check if this is a chained this path (this.foo.bar)
        if (node.head && node.head.type === 'ThisHead' && node.parts && node.parts.length > 1) {
          context.report({
            node,
            messageId: 'noChainedThis',
            data: {
              path: node.original,
            },
          });
        }
      },
    };
  },
};
