/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require lang attribute on html element',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-lang-attribute.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missing: 'The <html> element must have a lang attribute.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag === 'html') {
          const langAttr = node.attributes?.find((a) => a.name === 'lang');
          if (!langAttr) {
            context.report({
              node,
              messageId: 'missing',
            });
          }
        }
      },
    };
  },
};
