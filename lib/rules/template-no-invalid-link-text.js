/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid or uninformative link text content',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-link-text.md',
    },
    fixable: null,
    schema: [],
    messages: {
      invalidText:
        'Link text "{{text}}" is not descriptive. Use meaningful text that describes the link destination.',
    },
  },

  create(context) {
    const INVALID_LINK_TEXTS = new Set([
      'click here',
      'here',
      'link',
      'read more',
      'more',
      'click',
      'this',
      'read',
    ]);

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'a' && node.tag !== 'LinkTo') {
          return;
        }

        // Skip if has aria-label or aria-labelledby
        const hasAriaLabel = node.attributes?.some(
          (attr) => attr.name === 'aria-label' || attr.name === 'aria-labelledby'
        );
        if (hasAriaLabel) {
          return;
        }

        const textContent = getTextContent(node);

        if (textContent && INVALID_LINK_TEXTS.has(textContent)) {
          context.report({
            node,
            messageId: 'invalidText',
            data: { text: textContent },
          });
        }
      },
    };
  },
};

function getTextContent(node) {
  let text = '';

  if (node.type === 'GlimmerTextNode') {
    text += node.chars;
  } else if (node.children) {
    for (const child of node.children) {
      text += getTextContent(child);
    }
  }

  return text.trim().toLowerCase();
}
