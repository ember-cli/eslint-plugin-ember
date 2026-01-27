function hasAttr(node, name) {
  return node.attributes?.some((a) => a.name === name);
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require label for form input elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-input-label.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          labelTags: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireLabel: 'Input elements should have an associated label.',
      multipleLabels: 'Input element has multiple labelling mechanisms.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const customLabelTags = options.labelTags || [];
    const labelTags = new Set(['label', ...customLabelTags]);
    const elementStack = [];

    function isWrappedInLabel() {
      return elementStack.some((tag) => labelTags.has(tag));
    }

    return {
      GlimmerElementNode(node) {
        elementStack.push(node.tag);

        const tagName = node.tag?.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea' && tagName !== 'select') {
          return;
        }

        // Skip if input has type="hidden"
        const typeAttr = node.attributes?.find((a) => a.name === 'type');
        if (typeAttr?.value?.type === 'GlimmerTextNode' && typeAttr.value.chars === 'hidden') {
          return;
        }

        // Skip elements with ...attributes (splattributes)
        if (hasAttr(node, '...attributes')) {
          return;
        }

        const hasId = hasAttr(node, 'id');
        const hasAriaLabel = hasAttr(node, 'aria-label') || hasAttr(node, 'aria-labelledby');
        const inLabel = isWrappedInLabel();

        // Count labelling mechanisms
        let labelCount = 0;
        if (hasId) {
          labelCount++;
        }
        if (hasAriaLabel) {
          labelCount++;
        }
        if (inLabel) {
          labelCount++;
        }

        if (labelCount > 1) {
          context.report({ node, messageId: 'multipleLabels' });
        } else if (labelCount === 0) {
          context.report({ node, messageId: 'requireLabel' });
        }
      },
      'GlimmerElementNode:exit'() {
        elementStack.pop();
      },
    };
  },
};
