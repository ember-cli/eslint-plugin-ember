const REDUNDANT_WORDS = ['image', 'photo', 'picture', 'logo', 'spacer'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require valid alt text for images',
      category: 'Accessibility',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-valid-alt-text.md',
    },
    schema: [],
    messages: {
      redundant:
        'Invalid alt attribute. Words such as `image`, `photo`, or `picture` are already announced by screen readers.',
      missing: 'img elements must have an alt attribute',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        // Skip if hidden or aria-hidden
        const hasHidden = node.attributes?.some((a) => a.name === 'hidden');
        const ariaHidden = node.attributes?.find((a) => a.name === 'aria-hidden');
        if (
          hasHidden ||
          (ariaHidden?.value?.type === 'GlimmerTextNode' && ariaHidden.value.chars === 'true')
        ) {
          return;
        }

        if (node.tag === 'img') {
          const altAttr = node.attributes?.find((a) => a.name === 'alt');

          if (!altAttr) {
            context.report({ node, messageId: 'missing' });
            return;
          }

          if (altAttr.value?.type === 'GlimmerTextNode') {
            const altText = altAttr.value.chars.toLowerCase();
            const hasRedundantWord = REDUNDANT_WORDS.some((word) => altText.includes(word));
            if (hasRedundantWord) {
              context.report({ node: altAttr, messageId: 'redundant' });
            }
          }
        }
      },
    };
  },
};
