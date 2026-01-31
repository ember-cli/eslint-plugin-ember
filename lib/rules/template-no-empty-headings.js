const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function hasTextContent(node) {
  if (!node.children || node.children.length === 0) {
    return false;
  }

  for (const child of node.children) {
    // Text nodes with content
    if (child.type === 'GlimmerTextNode' && child.chars.trim().length > 0) {
      return true;
    }
    // Mustache statements or helpers
    if (child.type === 'GlimmerMustacheStatement' || child.type === 'GlimmerBlockStatement') {
      return true;
    }
    // Nested elements
    if (child.type === 'GlimmerElementNode' && hasTextContent(child)) {
      return true;
    }
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow empty heading elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-empty-headings.md',
    },
    schema: [],
    messages: {
      emptyHeading:
        'Headings must contain accessible text content (or helper/component that provides text).',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        if (HEADINGS.has(node.tag)) {
          // Skip if hidden
          const hasHidden = node.attributes?.some((a) => a.name === 'hidden');
          const ariaHidden = node.attributes?.find((a) => a.name === 'aria-hidden');
          if (
            hasHidden ||
            (ariaHidden?.value?.type === 'GlimmerTextNode' && ariaHidden.value.chars === 'true')
          ) {
            return;
          }

          if (!hasTextContent(node)) {
            context.report({ node, messageId: 'emptyHeading' });
          }
        }
      },
    };
  },
};
