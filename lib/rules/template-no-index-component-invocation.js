/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow invocation of index components',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-index-component-invocation.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noIndexInvocation:
        'Do not invoke components with /index suffix. Use the parent directory name instead.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag && typeof node.tag === 'string') {
          // Check if tag ends with ::Index (case-insensitive)
          if (/::index$/i.test(node.tag)) {
            context.report({
              node,
              messageId: 'noIndexInvocation',
            });
          }
        }
      },
    };
  },
};
