/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline styles',
      category: 'Best Practices',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-styles.md',
    },
    schema: [],
    messages: { noInlineStyles: 'Inline styles are not allowed' },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        const styleAttr = node.attributes?.find((a) => a.name === 'style');
        if (styleAttr) {
          context.report({ node: styleAttr, messageId: 'noInlineStyles' });
        }
      },
    };
  },
};
