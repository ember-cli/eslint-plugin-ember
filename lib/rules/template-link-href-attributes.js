/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require href attribute on link elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-link-href-attributes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingHref:
        '<a> elements must have an href attribute. Use <button> for clickable elements that are not links.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'a') {
          return;
        }

        const hasHref = node.attributes?.some((attr) => attr.name === 'href');

        if (!hasHref) {
          context.report({
            node,
            messageId: 'missingHref',
          });
        }
      },
    };
  },
};
