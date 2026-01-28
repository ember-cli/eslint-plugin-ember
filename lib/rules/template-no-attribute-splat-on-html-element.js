/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow ...attributes on HTML elements',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-attribute-splat-on-html-element.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noAttributeSplat:
        'Do not use ...attributes on HTML elements. Use it only on component elements.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        // Check if it's an HTML element (lowercase tag)
        if (node.tag && node.tag[0] === node.tag[0].toLowerCase() && node.attributes) {
          for (const attr of node.attributes) {
            if (attr.name === '...attributes') {
              context.report({
                node: attr,
                messageId: 'noAttributeSplat',
              });
            }
          }
        }
      },
    };
  },
};
