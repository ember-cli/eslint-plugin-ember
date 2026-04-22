const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

// aria-hidden semantics for valueless / empty / "false" are genuinely
// contested — four ecosystem positions exist (jsx-a11y / vue-a11y / axe /
// WAI-ARIA spec), see PR body. This rule leans toward FEWER false positives:
// when the author has written `aria-hidden` in any form that could plausibly
// mean "hide this", we exempt the heading from the empty-content check. The
// downside (missing some genuinely-empty headings) is preferable to flagging
// correctly-authored headings the developer intentionally decorated.
//
// Truthy:
//  - valueless attr (`<h1 aria-hidden>`) — default-undefined per spec, but
//    authors who write bare `aria-hidden` plausibly intend hidden.
//  - empty string `aria-hidden=""` — same.
//  - `aria-hidden="true"` / "TRUE" / "True" (ASCII case-insensitive).
//  - `aria-hidden={{true}}` mustache boolean literal.
//  - `aria-hidden={{"true"}}` / case-variants as mustache string literal.
// Not truthy (falls through):
//  - `aria-hidden="false"` / `{{false}}` / `{{"false"}}` — explicit opt-out.
function isAriaHiddenTruthy(attr) {
  if (!attr) {
    return false;
  }
  const value = attr.value;
  // Valueless attribute — no `value` property at all.
  if (!value) {
    return true;
  }
  if (value.type === 'GlimmerTextNode') {
    const chars = value.chars.toLowerCase();
    // Empty string is exempted (lean toward fewer false positives).
    return chars === '' || chars === 'true';
  }
  if (value.type === 'GlimmerMustacheStatement' && value.path) {
    if (value.path.type === 'GlimmerBooleanLiteral') {
      return value.path.value === true;
    }
    if (value.path.type === 'GlimmerStringLiteral') {
      return value.path.value.toLowerCase() === 'true';
    }
  }
  if (value.type === 'GlimmerConcatStatement') {
    // Quoted-mustache form like aria-hidden="{{true}}" or aria-hidden="{{x}}".
    // Only resolve when the concat is a single static-literal part; any
    // dynamic path makes the runtime value unknown. Lean toward "truthy"
    // only on literal `true` / empty-literal / bare-valueless to stay aligned
    // with the doc-stated ethos (fewer false positives — don't flag headings
    // the author has intentionally decorated with aria-hidden).
    const parts = value.parts || [];
    if (parts.length === 1) {
      const only = parts[0];
      if (only.type === 'GlimmerMustacheStatement' && only.path) {
        if (only.path.type === 'GlimmerBooleanLiteral') {
          return only.path.value === true;
        }
        if (only.path.type === 'GlimmerStringLiteral') {
          return only.path.value.toLowerCase() === 'true';
        }
      }
      if (only.type === 'GlimmerTextNode') {
        const chars = only.chars.toLowerCase();
        return chars === '' || chars === 'true';
      }
    }
    return false;
  }
  return false;
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
