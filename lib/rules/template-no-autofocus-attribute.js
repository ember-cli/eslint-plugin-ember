/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow autofocus attribute',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-autofocus-attribute.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noAutofocus:
        'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const autofocusAttr = node.attributes?.find((attr) => attr.name === 'autofocus');

        if (autofocusAttr) {
          context.report({
            node: autofocusAttr,
            messageId: 'noAutofocus',
          });
        }
      },

      GlimmerMustacheStatement(node) {
        if (!node.hash || !node.hash.pairs) {
          return;
        }
        const autofocusPair = node.hash.pairs.find((pair) => pair.key === 'autofocus');
        if (autofocusPair) {
          context.report({
            node: autofocusPair,
            messageId: 'noAutofocus',
          });
        }
      },
    };
  },
};
