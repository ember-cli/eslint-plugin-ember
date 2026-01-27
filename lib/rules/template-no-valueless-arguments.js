/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow valueless named arguments',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-valueless-arguments.md',
    },
    schema: [],
    messages: { valueless: 'Named arguments should have an explicitly assigned value.' },
  },
  create(context) {
    return {
      GlimmerAttrNode(node) {
        // Check if it's a named argument (@foo) with no value
        if (node.name?.startsWith('@') && (!node.value || node.value.type === 'GlimmerTextNode' && !node.value.chars)) {
          context.report({ node, messageId: 'valueless' });
        }
      },
    };
  },
};
