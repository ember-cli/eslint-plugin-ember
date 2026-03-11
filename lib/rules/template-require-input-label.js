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
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-input-label.md',
      templateMode: 'both',
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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-input-label.js',
      docs: 'docs/rule/require-input-label.md',
      tests: 'test/unit/rules/require-input-label-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const customLabelTags = options.labelTags || [];
    const labelTags = new Set(['label', ...customLabelTags]);
    const elementStack = [];

    function hasValidLabelParent() {
      for (let i = elementStack.length - 1; i >= 0; i--) {
        const entry = elementStack[i];
        if (labelTags.has(entry.tag)) {
          // Custom label tags (not 'label') are always considered valid
          if (entry.tag !== 'label') {
            return true;
          }
          // For 'label' tag, valid only if it has more than one child (text content + input)
          const children = entry.node.children || [];
          return children.length > 1;
        }
      }
      return false;
    }

    return {
      GlimmerElementNode(node) {
        elementStack.push({ tag: node.tag, node });

        const tagName = node.tag?.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea' && tagName !== 'select') {
          return;
        }

        // Skip if input has type="hidden"
        const typeAttr = node.attributes?.find((a) => a.name === 'type');
        if (typeAttr?.value?.type === 'GlimmerTextNode' && typeAttr.value.chars === 'hidden') {
          return;
        }

        // Skip if has ...attributes (can't determine labelling)
        if (hasAttr(node, '...attributes')) {
          return;
        }

        let labelCount = 0;
        const validLabel = hasValidLabelParent();
        if (validLabel) {
          labelCount++;
        }

        const hasId = hasAttr(node, 'id');
        const hasAriaLabel = hasAttr(node, 'aria-label');
        const hasAriaLabelledBy = hasAttr(node, 'aria-labelledby');
        if (hasId) {
          labelCount++;
        }
        if (hasAriaLabel) {
          labelCount++;
        }
        if (hasAriaLabelledBy) {
          labelCount++;
        }

        if (labelCount === 1) {
          return;
        }

        // Special case: label parent + id is OK (common pattern)
        if (validLabel && hasId) {
          return;
        }

        context.report({
          node,
          messageId: labelCount === 0 ? 'requireLabel' : 'multipleLabels',
        });
      },
      'GlimmerElementNode:exit'() {
        elementStack.pop();
      },

      GlimmerMustacheStatement(node) {
        const name = node.path?.original;
        if (name !== 'input' && name !== 'textarea') {
          return;
        }

        const pairs = node.hash?.pairs || [];

        function hasPair(key) {
          return pairs.some((p) => p.key === key);
        }

        // Skip if type="hidden" (literal string only)
        const typePair = pairs.find((p) => p.key === 'type');
        if (typePair?.value?.type === 'GlimmerStringLiteral' && typePair.value.value === 'hidden') {
          return;
        }

        // If in a valid label, it's valid
        if (hasValidLabelParent()) {
          return;
        }

        // If has id, it's valid
        if (hasPair('id')) {
          return;
        }

        context.report({
          node,
          messageId: 'requireLabel',
        });
      },
    };
  },
};
