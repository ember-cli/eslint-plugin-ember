/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow block usage of {{input}} helper',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-input-block.md',
    },
    schema: [],
    messages: { blockUsage: 'Unexpected block usage. The input helper may only be used inline.' },
  },
  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'input') {
          context.report({ node, messageId: 'blockUsage' });
        }
      },
    };
  },
};
