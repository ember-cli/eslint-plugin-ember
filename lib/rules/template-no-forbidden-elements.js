/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific HTML elements',
      category: 'Best Practices',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-forbidden-elements.md',
    },
    schema: [{ type: 'array', items: { type: 'string' } }],
    messages: { forbidden: 'Use of forbidden element <{{element}}>' },
  },
  create(context) {
    const forbidden = new Set(context.options[0] || []);
    return {
      GlimmerElementNode(node) {
        if (forbidden.has(node.tag)) {
          context.report({ node, messageId: 'forbidden', data: { element: node.tag } });
        }
      },
    };
  },
};
