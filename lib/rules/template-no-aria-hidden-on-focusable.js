'use strict';

const { isNativeElement } = require('../utils/is-native-element');
const { getStaticAttrValue } = require('../utils/static-attr-value');
const { classifyAttribute } = require('../utils/glimmer-attr-presence');

function findAttr(node, name) {
  return node.attributes?.find((a) => a.name === name);
}

// Returns the statically-known string value of a named attribute, or
// `undefined` when the attribute is absent or its value is dynamic.
function getTextAttrValue(node, name) {
  const attr = findAttr(node, name);
  if (!attr) {
    return undefined;
  }
  return getStaticAttrValue(attr.value);
}

// Per WAI-ARIA 1.2 §6.6 + aria-hidden value table, a missing or empty-string
// aria-hidden resolves to the default `undefined` — NOT `true`. So only an
// explicit `"true"` (ASCII case-insensitive per HTML enumerated-attribute
// rules) hides the element. Mustache boolean-literal `{{true}}` and
// string-literal `{{"true"}}` also qualify.
function isAriaHiddenTrue(node) {
  const value = findAttr(node, 'aria-hidden')?.value;
  if (!value) {
    return false;
  }
  // Resolve through getStaticAttrValue so quoted-mustache concat forms
  // (e.g. aria-hidden="{{true}}") and case variants normalize uniformly.
  const resolved = getStaticAttrValue(value);
  if (typeof resolved !== 'string') {
    return false;
  }
  return resolved.trim().toLowerCase() === 'true';
}

// Tags with an unconditional default focusable UI (sequentially focusable per
// HTML §6.6.3 "focusable area" + widget roles per HTML-AAM).
// NOTE: <label> is HTML-interactive-content (§3.2.5.2.7) but NOT keyboard-
// focusable by default — clicks on a label forward to its associated control,
// but the label itself isn't in the tab order. So it's excluded here even
// though `isHtmlInteractiveContent` would return true for it.
const UNCONDITIONAL_FOCUSABLE_TAGS = new Set([
  'button',
  'select',
  'textarea',
  'iframe',
  'embed',
  'summary',
  'details',
  'option',
  'datalist',
]);

// Form-control tags whose `disabled` attribute removes them from the tab order
// (HTML §4.10.18.5 "disabled" + HTML §6.6.3 "focusable area").
const DISABLEABLE_TAGS = new Set(['button', 'input', 'select', 'textarea', 'fieldset']);

function isDisabledFormControl(node, tag) {
  if (!DISABLEABLE_TAGS.has(tag)) {
    return false;
  }
  const attr = findAttr(node, 'disabled');
  // Per docs/glimmer-attribute-behavior.md (rows d3, d6 plus cross-attribute
  // observation on falsy-coercion), bare-mustache falsy literals on a boolean
  // HTML attribute cause Glimmer to omit the attribute at runtime. We use
  // classifyAttribute so the runtime-rendered presence drives the answer
  // rather than AST-presence.
  return classifyAttribute(attr).presence === 'present';
}

// Narrow rule-local "keyboard-focusable" check. Intentionally distinct from
// `isHtmlInteractiveContent` (HTML content-model) — we want the sequential-
// focus + programmatic-focus axis only. See WAI-ARIA "focusable" definition
// and HTML §6.6.3.
function isKeyboardFocusable(node, getTextAttrValueFn) {
  const rawTag = node?.tag;
  if (typeof rawTag !== 'string' || rawTag.length === 0) {
    return false;
  }
  const tag = rawTag.toLowerCase();

  // Disabled form controls are not focusable.
  if (isDisabledFormControl(node, tag)) {
    return false;
  }

  // Any tabindex (including "-1") makes the element at least programmatically
  // focusable — still a keyboard-trap risk under aria-hidden. Use
  // classifyAttribute so bare `{{false}}` / `{{null}}` / `{{undefined}}`
  // (rows t6, t7) — which Glimmer omits at runtime — are NOT treated as
  // having a tabindex.
  if (classifyAttribute(findAttr(node, 'tabindex')).presence === 'present') {
    return true;
  }

  // contenteditable (truthy) makes the element focusable.
  const contentEditable = getTextAttrValueFn(node, 'contenteditable');
  if (contentEditable !== undefined && contentEditable !== null) {
    const normalized = contentEditable.trim().toLowerCase();
    // per HTML spec, "", "true", and "plaintext-only" all enable editing.
    if (normalized === '' || normalized === 'true' || normalized === 'plaintext-only') {
      return true;
    }
  }

  if (UNCONDITIONAL_FOCUSABLE_TAGS.has(tag)) {
    return true;
  }

  if (tag === 'input') {
    const type = getTextAttrValueFn(node, 'type');
    return type === undefined || type === null || type.trim().toLowerCase() !== 'hidden';
  }

  if (tag === 'a' || tag === 'area') {
    return Boolean(findAttr(node, 'href'));
  }

  if (tag === 'img') {
    return Boolean(findAttr(node, 'usemap'));
  }

  if (tag === 'audio' || tag === 'video') {
    return Boolean(findAttr(node, 'controls'));
  }

  return false;
}

// A focusable descendant of an aria-hidden="true" ancestor can still receive
// focus (aria-hidden does not remove elements from the tab order), so the
// ancestor hides AT-visible content that remains keyboard-reachable — a
// keyboard trap. This rule targets the anti-pattern flagged by axe's
// `aria-hidden-focus` check and by jsx-a11y's `no-aria-hidden-on-focusable`.
// WAI-ARIA 1.2 says authors SHOULD NOT put aria-hidden on focusable content
// (the spec normatively warns against this in the aria-hidden authoring note).
function hasFocusableDescendant(node, sourceCode) {
  const children = node.children;
  if (!children || children.length === 0) {
    return false;
  }
  for (const child of children) {
    if (child.type !== 'GlimmerElementNode') {
      // Skip TextNode, GlimmerMustacheStatement (dynamic content), yield
      // expressions, and anything else whose rendered element we can't inspect.
      continue;
    }
    if (!isNativeElement(child, sourceCode)) {
      // Component / dynamic / shadowed tag — opaque. Don't recurse.
      continue;
    }
    if (isKeyboardFocusable(child, getTextAttrValue)) {
      return true;
    }
    if (hasFocusableDescendant(child, sourceCode)) {
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
      description: 'disallow aria-hidden="true" on focusable elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-aria-hidden-on-focusable.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noAriaHiddenOnFocusable:
        'aria-hidden="true" must not be set on focusable elements — it creates a keyboard trap (element reachable via Tab but hidden from assistive tech).',
      noAriaHiddenOnAncestorOfFocusable:
        'aria-hidden="true" must not be set on an element that contains focusable descendants — the descendants remain keyboard-reachable but are hidden from assistive tech.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      GlimmerElementNode(node) {
        if (!isAriaHiddenTrue(node)) {
          return;
        }
        if (!isNativeElement(node, sourceCode)) {
          return;
        }
        if (isKeyboardFocusable(node, getTextAttrValue)) {
          context.report({ node, messageId: 'noAriaHiddenOnFocusable' });
          return;
        }
        if (hasFocusableDescendant(node, sourceCode)) {
          context.report({ node, messageId: 'noAriaHiddenOnAncestorOfFocusable' });
        }
      },
    };
  },
};
