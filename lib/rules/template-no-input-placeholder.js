/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow placeholder attribute on input elements',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-input-placeholder.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noPlaceholder:
        'Do not use placeholder attribute. Use a label instead for better accessibility.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag === 'input' && node.attributes) {
          for (const attr of node.attributes) {
            if (attr.type === 'GlimmerAttrNode' && attr.name === 'placeholder') {
              context.report({
                node: attr,
                messageId: 'noPlaceholder',
              });
            }
          }
        }
      },
    };
  },
};
