const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function isHidden(node) {
  if (!node.attributes) return false;
  if (node.attributes.some((a) => a.name === 'hidden')) return true;
  const ariaHidden = node.attributes.find((a) => a.name === 'aria-hidden');
  if (ariaHidden?.value?.type === 'GlimmerTextNode' && ariaHidden.value.chars === 'true')
    return true;
  return false;
}

function isComponent(node) {
  if (node.type !== 'GlimmerElementNode') return false;
  const tag = node.tag;
  return /^[A-Z]/.test(tag) || tag.includes('::');
}

function isTextEmpty(text) {
  // Treat &nbsp; (U+00A0) and regular whitespace as empty
  return (
    text
      .replace(/[\s\u00A0]/g, '')
      .replace(/&nbsp;/g, '')
      .length === 0
  );
}

function hasAccessibleContent(node) {
  if (!node.children || node.children.length === 0) return false;

  for (const child of node.children) {
    // Text nodes — only counts if it has real visible characters
    if (child.type === 'GlimmerTextNode') {
      if (!isTextEmpty(child.chars)) return true;
      continue;
    }

    // Mustache/block statements are dynamic content
    if (child.type === 'GlimmerMustacheStatement' || child.type === 'GlimmerBlockStatement') {
      return true;
    }

    // Element nodes
    if (child.type === 'GlimmerElementNode') {
      // Skip hidden elements entirely
      if (isHidden(child)) continue;

      // Component invocations count as content (they may render text)
      if (isComponent(child)) return true;

      // Recurse into non-hidden, non-component elements
      if (hasAccessibleContent(child)) return true;
    }
  }
  return false;
}

function isHeadingElement(node) {
  if (HEADINGS.has(node.tag)) return true;
  // Also detect <div role="heading" ...>
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (roleAttr?.value?.type === 'GlimmerTextNode' && roleAttr.value.chars === 'heading')
    return true;
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
        if (isHeadingElement(node)) {
          // Skip if the heading itself is hidden
          if (isHidden(node)) return;

          if (!hasAccessibleContent(node)) {
            context.report({ node, messageId: 'emptyHeading' });
          }
        }
      },
    };
  },
};
