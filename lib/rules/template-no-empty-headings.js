const { getStaticAttrValue } = require('../utils/static-attr-value');

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

// Aligned with WAI-ARIA 1.2 §6.6 aria-hidden value table: only an explicit
// "true" (ASCII case-insensitive, whitespace-trimmed) hides the element.
// Valueless `<h1 aria-hidden>`, empty-string `aria-hidden=""`, and
// `aria-hidden="false"` all resolve to the default `undefined` / explicit
// false — so the empty-content check still applies. All shape-unwrapping
// (mustache/concat) goes through the shared `getStaticAttrValue` helper.
function isAriaHiddenTruthy(attr) {
  if (!attr) {
    return false;
  }
  const resolved = getStaticAttrValue(attr.value);
  if (resolved === undefined) {
    // Dynamic — can't prove truthy.
    return false;
  }
  return resolved.trim().toLowerCase() === 'true';
}

function isHidden(node) {
  if (!node.attributes) {
    return false;
  }
  if (node.attributes.some((a) => a.name === 'hidden')) {
    return true;
  }
  return isAriaHiddenTruthy(node.attributes.find((a) => a.name === 'aria-hidden'));
}

function isComponent(node) {
  if (node.type !== 'GlimmerElementNode') {
    return false;
  }
  const tag = node.tag;
  // PascalCase (<MyComponent>), namespaced (<Foo::Bar>), this.-prefixed
  // (<this.Component>), arg-prefixed (<@component>), or dot-path (<ns.Widget>)
  return (
    /^[A-Z]/.test(tag) ||
    tag.includes('::') ||
    tag.startsWith('this.') ||
    tag.startsWith('@') ||
    tag.includes('.')
  );
}

function isTextEmpty(text) {
  // Treat &nbsp; (U+00A0) and regular whitespace as empty
  return text.replaceAll(/\s/g, '').replaceAll('&nbsp;', '').length === 0;
}

function hasAccessibleContent(node) {
  if (!node.children || node.children.length === 0) {
    return false;
  }

  for (const child of node.children) {
    // Text nodes — only counts if it has real visible characters
    if (child.type === 'GlimmerTextNode') {
      if (!isTextEmpty(child.chars)) {
        return true;
      }
      continue;
    }

    // Mustache/block statements are dynamic content
    if (child.type === 'GlimmerMustacheStatement' || child.type === 'GlimmerBlockStatement') {
      return true;
    }

    // Element nodes
    if (child.type === 'GlimmerElementNode') {
      // Skip hidden elements entirely
      if (isHidden(child)) {
        continue;
      }

      // Component invocations count as content (they may render text)
      if (isComponent(child)) {
        return true;
      }

      // Recurse into non-hidden, non-component elements
      if (hasAccessibleContent(child)) {
        return true;
      }
    }
  }
  return false;
}

function isHeadingElement(node) {
  if (HEADINGS.has(node.tag)) {
    return true;
  }
  // Also detect <div role="heading" ...>
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (roleAttr?.value?.type === 'GlimmerTextNode' && roleAttr.value.chars === 'heading') {
    return true;
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

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-empty-headings.md',
    },
    schema: [],
    messages: {
      emptyHeading:
        'Headings must contain accessible text content (or helper/component that provides text).',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-empty-headings.js',
      docs: 'docs/rule/no-empty-headings.md',
      tests: 'test/unit/rules/no-empty-headings-test.js',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        if (isHeadingElement(node)) {
          // Skip if the heading itself is hidden
          if (isHidden(node)) {
            return;
          }

          if (!hasAccessibleContent(node)) {
            context.report({ node, messageId: 'emptyHeading' });
          }
        }
      },
    };
  },
};
