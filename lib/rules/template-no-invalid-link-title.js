/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid title attributes on link elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-link-title.md',
    },
    schema: [],
    messages: {
      noInvalidLinkTitle: 'Link title attribute should not be the same as link text or empty.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'a') {
          return;
        }

        const titleAttr = node.attributes.find(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'title'
        );

        if (!titleAttr || titleAttr.value.type !== 'GlimmerTextNode') {
          return;
        }

        const titleValue = titleAttr.value.chars.trim();

        if (!titleValue) {
          context.report({
            node: titleAttr,
            messageId: 'noInvalidLinkTitle',
          });
          return;
        }

        if (node.children.length === 1 && node.children[0].type === 'GlimmerTextNode') {
          const textContent = node.children[0].chars.trim();
          if (textContent && textContent === titleValue) {
            context.report({
              node: titleAttr,
              messageId: 'noInvalidLinkTitle',
            });
          }
        }
      },
    };
  },
};
