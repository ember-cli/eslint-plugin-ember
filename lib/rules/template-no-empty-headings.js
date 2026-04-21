const { getStaticAttrValue } = require('../utils/static-attr-value');
const { isNativeElement } = require('../utils/is-native-element');

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

// Aligned with the WAI-ARIA 1.2 [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden)
// value table (`true | false | undefined (default)`): treat only an explicit
// "true" (ASCII case-insensitive, whitespace-trimmed) as hiding the element.
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

function isTextEmpty(text) {
  // Treat &nbsp; (U+00A0) and regular whitespace as empty
  return text.replaceAll(/\s/g, '').replaceAll('&nbsp;', '').length === 0;
}

function hasAccessibleContent(node, sourceCode) {
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

      // Component invocations (including custom elements and scope-bound
      // identifiers) are opaque — we can't see inside, so assume content.
      if (!isNativeElement(child, sourceCode)) {
        return true;
      }

      // Recurse into native HTML/SVG/MathML elements.
      if (hasAccessibleContent(child, sourceCode)) {
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
    const sourceCode = context.sourceCode;
    return {
      GlimmerElementNode(node) {
        if (isHeadingElement(node)) {
          // Skip if the heading itself is hidden
          if (isHidden(node)) {
            return;
          }

          if (!hasAccessibleContent(node, sourceCode)) {
            context.report({ node, messageId: 'emptyHeading' });
          }
        }
      },
    };
  },
};
