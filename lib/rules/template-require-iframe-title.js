/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require iframe elements to have a title attribute',
      category: 'Accessibility',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-iframe-title.md',
    },
    schema: [],
    messages: {
      missingTitle: '<iframe> elements must have a unique title property.',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'iframe') return;

        // Skip if aria-hidden or hidden
        const hasAriaHidden = node.attributes?.some((a) => a.name === 'aria-hidden');
        const hasHidden = node.attributes?.some((a) => a.name === 'hidden');
        if (hasAriaHidden || hasHidden) return;

        // Check for title attribute
        const titleAttr = node.attributes?.find((a) => a.name === 'title');
        if (!titleAttr) {
          context.report({ node, messageId: 'missingTitle' });
        } else if (
          titleAttr.value?.type === 'GlimmerTextNode' &&
          !titleAttr.value.chars.trim()
        ) {
          context.report({ node, messageId: 'missingTitle' });
        }
      },
    };
  },
};
