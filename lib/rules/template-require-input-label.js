/**
 * @fileoverview Require label for form input elements
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require label for form input elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-input-label.md',
    },
    schema: [],
    messages: {
      requireLabel: 'Input elements should have an associated label',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const tagName = node.tag.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea' && tagName !== 'select') {
          return;
        }

        // Skip if input has type="hidden"
        const typeAttr = node.attributes.find(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'type'
        );
        if (typeAttr && typeAttr.value) {
          // Check if value is GlimmerTextNode with "hidden"
          if (typeAttr.value.type === 'GlimmerTextNode' && typeAttr.value.chars === 'hidden') {
            return;
          }
          // Check if value is ConcatStatement (for dynamic values) - skip those
          if (typeAttr.value.type === 'ConcatStatement') {
            return;
          }
        }

        // Check for id attribute
        const hasId = node.attributes.some(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'id'
        );

        // Check for aria-label or aria-labelledby
        const hasAriaLabel = node.attributes.some(
          (attr) =>
            attr.type === 'GlimmerAttrNode' &&
            (attr.name === 'aria-label' || attr.name === 'aria-labelledby')
        );

        if (!hasId && !hasAriaLabel) {
          context.report({
            node,
            messageId: 'requireLabel',
          });
        }
      },
    };
  },
};
