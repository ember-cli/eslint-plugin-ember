'use strict';

const { isNativeElement } = require('../utils/is-native-element');
const { getStaticAttrValue } = require('../utils/static-attr-value');

function isDynamicValue(value) {
  return value?.type === 'GlimmerMustacheStatement' || value?.type === 'GlimmerConcatStatement';
}

// Returns true if the `aria-hidden` attribute is explicitly set to "true"
// (case-insensitive) or mustache-literal `{{true}}` / `{{"true"}}` / the
// quoted-mustache concat equivalents. Per WAI-ARIA 1.2 §6.6 + aria-hidden
// value table, valueless / empty-string `aria-hidden` resolves to the
// default `undefined` — NOT `true` — so those forms do NOT hide the
// element per spec. This aligns with the spec-first decisions in #2717 /
// #19 / #33, and diverges from jsx-a11y's JSX-coercion convention. All
// shape-unwrapping is delegated to the shared `getStaticAttrValue` helper.
function isAriaHiddenTrue(attr) {
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

// True if the anchor itself declares an accessible name via a statically
// non-empty `aria-label`, `aria-labelledby`, or `title`, OR via a dynamic
// value (we can't know at lint time whether a mustache resolves to an empty
// string, so we give the author the benefit of the doubt — matching the
// "skip dynamic" posture used by `template-no-invalid-link-text`).
function hasAccessibleNameAttribute(node) {
  const attrs = node.attributes || [];
  for (const name of ['aria-label', 'aria-labelledby', 'title']) {
    const attr = attrs.find((a) => a.name === name);
    if (!attr) {
      continue;
    }
    if (attr.value?.type === 'GlimmerMustacheStatement') {
      const resolved = getStaticAttrValue(attr.value);
      if (resolved === undefined) {
        // Truly dynamic (e.g. `aria-label={{@label}}`) — can't know at lint
        // time; give the author the benefit of the doubt.
        return true;
      }
      // Static string literal in mustache, e.g. `aria-label={{""}}`.
      // Treat exactly like a plain text value: non-empty means a name exists.
      if (resolved.trim().length > 0) {
        return true;
      }
      continue;
    }
    if (isDynamicValue(attr.value)) {
      // GlimmerConcatStatement — treat as dynamic.
      return true;
    }
    if (attr.value?.type === 'GlimmerTextNode') {
      // Normalize `&nbsp;` to space before the whitespace check — matches the
      // sibling rule `template-no-invalid-link-text`. `aria-label="&nbsp;"`
      // is functionally empty for assistive tech (no visual content, no
      // announced text) and shouldn't count as an accessible name.
      const chars = attr.value.chars.replaceAll('&nbsp;', ' ');
      if (chars.trim().length > 0) {
        return true;
      }
    }
  }
  return false;
}

// Recursively inspect a single child node and report how it would contribute
// to the anchor's accessible name.
//   { dynamic: true }       — opaque at lint time; treat anchor as labeled.
//   { accessible: true }    — statically contributes a non-empty name.
//   { accessible: false }   — contributes nothing (empty text, aria-hidden
//                             subtree, <img> without non-empty alt, …).
function evaluateChild(child, sourceCode) {
  if (child.type === 'GlimmerTextNode') {
    const text = child.chars.replaceAll('&nbsp;', ' ').trim();
    return { dynamic: false, accessible: text.length > 0 };
  }

  if (
    child.type === 'GlimmerMustacheStatement' ||
    child.type === 'GlimmerSubExpression' ||
    child.type === 'GlimmerBlockStatement'
  ) {
    // Dynamic content — can't statically tell whether it renders to something.
    // Mirror `template-no-invalid-link-text`'s stance and skip.
    return { dynamic: true, accessible: false };
  }

  if (child.type === 'GlimmerElementNode') {
    const attrs = child.attributes || [];
    const ariaHidden = attrs.find((a) => a.name === 'aria-hidden');
    if (isAriaHiddenTrue(ariaHidden)) {
      // aria-hidden subtrees contribute nothing, regardless of content.
      return { dynamic: false, accessible: false };
    }

    // HTML boolean `hidden` (§5.4) removes the element from rendering AND
    // from the accessibility tree — equivalent to aria-hidden="true" for
    // accessible-name purposes. A <span hidden>Backup</span> inside an
    // anchor contributes no name at runtime.
    if (attrs.some((a) => a.name === 'hidden')) {
      return { dynamic: false, accessible: false };
    }

    // Non-native children (components, custom elements, scope-shadowed tags)
    // are opaque — we can't see inside them.
    if (!isNativeElement(child, sourceCode)) {
      return { dynamic: true, accessible: false };
    }

    // An <img> child contributes its alt text to the anchor's accessible name.
    if (child.tag?.toLowerCase() === 'img') {
      const altAttr = attrs.find((a) => a.name === 'alt');
      if (!altAttr) {
        // Missing alt is a separate a11y concern; treat as no contribution.
        return { dynamic: false, accessible: false };
      }
      if (altAttr.value?.type === 'GlimmerMustacheStatement') {
        const resolved = getStaticAttrValue(altAttr.value);
        if (resolved === undefined) {
          // Truly dynamic (e.g. `alt={{@alt}}`) — trust the author.
          return { dynamic: true, accessible: false };
        }
        // Static string literal in mustache, e.g. `alt={{""}}` or
        // `alt={{"Search"}}` — treat exactly like a plain text value.
        return { dynamic: false, accessible: resolved.trim().length > 0 };
      }
      if (isDynamicValue(altAttr.value)) {
        // GlimmerConcatStatement — treat as dynamic.
        return { dynamic: true, accessible: false };
      }
      if (altAttr.value?.type === 'GlimmerTextNode') {
        // Same `&nbsp;` normalization as hasAccessibleNameAttribute above —
        // `<img alt="&nbsp;">` contributes no meaningful name.
        const chars = altAttr.value.chars.replaceAll('&nbsp;', ' ');
        return { dynamic: false, accessible: chars.trim().length > 0 };
      }
      return { dynamic: false, accessible: false };
    }

    // For any other HTML element child, recurse into its children AND its own
    // aria-label/aria-labelledby/title (author may label an inner <span>).
    if (hasAccessibleNameAttribute(child)) {
      return { dynamic: false, accessible: true };
    }

    return evaluateChildren(child.children || [], sourceCode);
  }

  return { dynamic: false, accessible: false };
}

function evaluateChildren(children, sourceCode) {
  let dynamic = false;
  for (const child of children) {
    const result = evaluateChild(child, sourceCode);
    if (result.accessible) {
      return { dynamic: false, accessible: true };
    }
    if (result.dynamic) {
      dynamic = true;
    }
  }
  return { dynamic, accessible: false };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require anchor elements to contain accessible content',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-anchor-has-content.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      anchorHasContent:
        'Anchors must have content and the content must be accessible by a screen reader.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    return {
      GlimmerElementNode(node) {
        // Only the native <a> element — in strict GJS, a lowercase tag can be
        // shadowed by an in-scope local binding, and components shouldn't be
        // validated here. `isNativeElement` combines authoritative html/svg/
        // mathml tag lists with scope-shadowing detection.
        if (!isNativeElement(node, sourceCode)) {
          return;
        }
        if (node.tag?.toLowerCase() !== 'a') {
          return;
        }

        // Only anchors acting as links (with href) are in scope. An <a> without
        // href is covered by `template-link-href-attributes` / not a link.
        const attrs = node.attributes || [];
        const hasHref = attrs.some((a) => a.name === 'href');
        if (!hasHref) {
          return;
        }

        // Skip anchors the author has explicitly hidden — either via the HTML
        // `hidden` boolean attribute (element is not rendered at all) or
        // `aria-hidden="true"` (element removed from the accessibility tree).
        // In both cases, "accessible name of an anchor" is moot.
        const hasHidden = attrs.some((a) => a.name === 'hidden');
        if (hasHidden) {
          return;
        }
        const ariaHiddenAttr = attrs.find((a) => a.name === 'aria-hidden');
        if (isAriaHiddenTrue(ariaHiddenAttr)) {
          return;
        }

        if (hasAccessibleNameAttribute(node)) {
          return;
        }

        const result = evaluateChildren(node.children || [], sourceCode);
        if (result.accessible || result.dynamic) {
          return;
        }

        context.report({ node, messageId: 'anchorHasContent' });
      },
    };
  },
};
