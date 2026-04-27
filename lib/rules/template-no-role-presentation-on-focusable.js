// Per WAI-ARIA 1.2 §4.6 Conflict Resolution, role="presentation" / role="none"
// does NOT cascade to descendants — each descendant retains its own role and
// semantics. So `<div role="presentation"><button>X</button></div>` is NOT a
// semantic problem: the div's role is a no-op (div had no meaningful role to
// suppress), and the button remains fully interactive with its role intact.
//
// Therefore, unlike the sibling rule `template-no-aria-hidden-on-focusable`
// (which recurses into descendants because aria-hidden DOES cascade and creates
// a keyboard trap landing on AT-hidden content), this rule only checks the
// element carrying the presentation role.
//
// Deliberately diverges from vue-a11y's no-role-presentation-on-focusable, which
// recurses into descendants. Vue's recursion is uncommented in their source and
// appears to be a copy-paste from their aria-hidden rule.

'use strict';

const { isNativeElement } = require('../utils/is-native-element');

function findAttr(node, name) {
  return node.attributes?.find((a) => a.name === name);
}

function getTextAttrValue(node, name) {
  const attr = findAttr(node, name);
  if (!attr) {
    return undefined;
  }
  // Valueless attribute (e.g. `<div contenteditable>`): HTML treats this as
  // the empty string, which is truthy for contenteditable per the HTML spec.
  if (attr.value === null) {
    return '';
  }
  if (attr.value?.type === 'GlimmerTextNode') {
    return attr.value.chars;
  }
  // Mustache literal: `contenteditable={{true}}` or `contenteditable={{"true"}}`
  if (attr.value?.type === 'GlimmerMustacheStatement') {
    const path = attr.value.path;
    if (path?.type === 'GlimmerBooleanLiteral') {
      return String(path.value);
    }
    if (path?.type === 'GlimmerStringLiteral') {
      return path.value;
    }
  }
  return undefined;
}

// Per WAI-ARIA "role" attribute semantics, when multiple whitespace-separated
// role tokens are supplied, user agents use the FIRST valid token. Subsequent
// tokens serve as author-provided fallbacks that only apply if the first is
// invalid/ignored. So `role="button presentation"` resolves to "button" — the
// element is NOT presentational. We only flag when the FIRST token is
// presentation/none.
function hasPresentationRole(node) {
  const attr = findAttr(node, 'role');
  if (!attr || attr.value?.type !== 'GlimmerTextNode') {
    return false;
  }
  const tokens = attr.value.chars.trim().toLowerCase().split(/\s+/u);
  const first = tokens[0];
  return first === 'presentation' || first === 'none';
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
  return Boolean(findAttr(node, 'disabled'));
}

// Narrow rule-local "keyboard-focusable" check. Intentionally distinct from
// `isHtmlInteractiveContent` (HTML content-model) — we want the sequential-
// focus + programmatic-focus axis only. See WAI-ARIA "focusable" definition
// and HTML §6.6.3.
function isKeyboardFocusable(node) {
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
  // focusable — still in scope for the semantic-conflict this rule targets.
  if (findAttr(node, 'tabindex')) {
    return true;
  }

  // contenteditable (truthy) makes the element focusable.
  const contentEditable = getTextAttrValue(node, 'contenteditable');
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
    const type = getTextAttrValue(node, 'type');
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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow role="presentation" / role="none" on focusable elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-role-presentation-on-focusable.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      invalidPresentation:
        'role="presentation"/"none" must not be used on focusable elements: user agents are expected to ignore role="presentation"/"none" on focusable elements (WAI-ARIA Presentational Roles Conflict Resolution, §4.6), so the markup is misleading — remove the role or remove the focus vector.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      GlimmerElementNode(node) {
        if (!isNativeElement(node, sourceCode)) {
          return;
        }
        if (!hasPresentationRole(node)) {
          return;
        }
        if (isKeyboardFocusable(node)) {
          context.report({ node, messageId: 'invalidPresentation' });
        }
      },
    };
  },
};
