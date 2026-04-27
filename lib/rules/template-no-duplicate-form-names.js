'use strict';

// See html-validate (https://html-validate.org/rules/form-dup-name.html) for the peer rule concept.
//
// Simplifications vs. upstream for v1: we don't support `name[]` array syntax,
// the <input type="hidden"> + <input type="checkbox"> default-value pattern,
// or the full form-associated element registry. Scope is <input>/<select>/
// <textarea>/<button>/<output>.
//
// Types that do not contribute to the form-data entry list (per HTML spec
// §4.10.21.4) are skipped entirely — no name collision is possible because
// they never submit. This covers <input type="button"|"reset"> and
// <button type="button"|"reset">.
//
// Types whose duplicate-name pattern is legitimate are tracked but allowed to
// share a name within their "share category":
//   - radio group: multiple <input type=radio> share a name by design (one
//     selected at a time);
//   - submit-like controls: at most one submit-like control contributes per
//     submission, so any mix of <input type=submit>, <input type=image>, and
//     <button> (bare or type=submit) can share a name.
// Derived from aria-query's button-role mapping; see `getShareCategory` below.

const { elementRoles } = require('aria-query');

const FORM_CONTROL_TAGS = new Set(['input', 'select', 'textarea', 'button', 'output']);
const NON_SUBMITTING_TYPES = new Set(['button', 'reset']);

// Submit-like <input> types — derived from aria-query's `button`-role mapping
// (input[type=submit|image|button|reset] all map to role=button), minus the
// non-submitting types. At most ONE submit-like control contributes to the
// form-data entry list per submission (the one the user clicks), so any mix
// of these can legitimately share a name.
//
// "Radio group" semantics are orthogonal: multiple <input type=radio> share a
// name because selection is mutually exclusive, and exactly one contributes
// its value. So radios get their own category.
const SUBMIT_LIKE_INPUT_TYPES = buildSubmitLikeInputTypes();

function buildSubmitLikeInputTypes() {
  const result = new Set();
  for (const [schema, rolesSet] of elementRoles) {
    if (schema.name !== 'input') {
      continue;
    }
    if (!rolesSet.includes('button')) {
      continue;
    }
    const typeAttr = (schema.attributes || []).find((a) => a.name === 'type');
    if (!typeAttr || typeof typeAttr.value !== 'string') {
      continue;
    }
    if (NON_SUBMITTING_TYPES.has(typeAttr.value)) {
      continue;
    }
    result.add(typeAttr.value);
  }
  return result;
}

// Returns the "share category" for a control type: entries with the same
// non-null category can legitimately share a name.
//   - 'radio': radio-group semantics (one selected at a time)
//   - 'submit-like': submit-control semantics (one triggers submission)
//   - null: not shareable; any same-name collision is a real duplicate
function getShareCategory(tag, type) {
  if (tag === 'input' && type === 'radio') {
    return 'radio';
  }
  if (tag === 'button') {
    // Bare <button> defaults to type=submit; <button type=submit> too.
    if (type === 'submit') {
      return 'submit-like';
    }
    return null;
  }
  if (tag === 'input' && SUBMIT_LIKE_INPUT_TYPES.has(type)) {
    return 'submit-like';
  }
  return null;
}

function findAttr(node, name) {
  return node.attributes?.find((attr) => attr.name === name);
}

function getStaticAttrValue(node, name) {
  const attr = findAttr(node, name);
  if (!attr || !attr.value) {
    return { kind: attr ? 'empty' : 'absent', value: '' };
  }
  if (attr.value.type === 'GlimmerTextNode') {
    return { kind: 'static', value: attr.value.chars };
  }
  if (attr.value.type === 'GlimmerMustacheStatement' && attr.value.path) {
    if (attr.value.path.type === 'GlimmerStringLiteral') {
      return { kind: 'static', value: attr.value.path.value };
    }
    if (attr.value.path.type === 'GlimmerBooleanLiteral') {
      return { kind: 'static', value: String(attr.value.path.value) };
    }
  }
  return { kind: 'dynamic', value: '' };
}

// HTML §4.10.18 — `<button>` and `<input>` with missing/invalid/unknown type
// fall back to the default state ('submit' for <button>, 'text' for <input>).
const BUTTON_TYPES = new Set(['submit', 'reset', 'button']);
const INPUT_TYPES = new Set([
  'hidden',
  'text',
  'search',
  'tel',
  'url',
  'email',
  'password',
  'date',
  'month',
  'week',
  'time',
  'datetime-local',
  'number',
  'range',
  'color',
  'checkbox',
  'radio',
  'file',
  'submit',
  'image',
  'reset',
  'button',
]);

function getControlType(node) {
  if (node.tag === 'button') {
    const t = getStaticAttrValue(node, 'type');
    if (t.kind === 'static') {
      return BUTTON_TYPES.has(t.value.toLowerCase()) ? t.value.toLowerCase() : 'submit';
    }
    if (t.kind === 'absent' || t.kind === 'empty') {
      // No type attribute, or valueless `<button type />` — both default to
      // 'submit' per HTML §4.10.9 (invalid/missing type → submit state).
      return 'submit';
    }
    // Dynamic type (mustache / concat) — runtime value is unknown. Return a
    // sentinel so the caller can skip duplicate-name checks for this node
    // rather than guessing the wrong default.
    return 'unknown';
  }
  if (node.tag === 'input') {
    const t = getStaticAttrValue(node, 'type');
    if (t.kind === 'static') {
      return INPUT_TYPES.has(t.value.toLowerCase()) ? t.value.toLowerCase() : 'text';
    }
    if (t.kind === 'absent' || t.kind === 'empty') {
      return 'text';
    }
    return 'unknown';
  }
  return node.tag;
}

function findEnclosingFormOrRoot(node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'GlimmerElementNode' && current.tag === 'form') {
      return current;
    }
    current = current.parent;
  }
  return null;
}

const { getBranchPath, areMutuallyExclusive } = require('../utils/control-flow');

// Per HTML spec (§4.10.21.4 "Constructing the entry list"), only `disabled`
// controls are skipped when building the form-data entry list. `hidden`
// does NOT affect submission — a hidden control still contributes its name
// and value. Duplicate-name collisions can therefore happen even when one
// of the controls is `hidden`.
//
// `disabled={{false}}` (boolean-literal mustache) is carved out: Glimmer VM
// normalizes boolean `false` to attribute removal at runtime (see
// `SimpleDynamicAttribute.update` → `removeAttribute`), so the rendered DOM
// has no `disabled` attribute and the control IS enabled. Matches the same
// carve-out in `template-no-autofocus-attribute`. Other falsy-looking forms
// — `disabled="false"` (static string), `disabled={{"false"}}` (string-
// literal mustache) — still mean disabled per HTML boolean-attribute
// semantics: presence = disabled regardless of value content.
function isDisabled(node) {
  const attr = findAttr(node, 'disabled');
  if (!attr) {
    return false;
  }
  const value = attr.value;
  if (
    value &&
    value.type === 'GlimmerMustacheStatement' &&
    value.path &&
    value.path.type === 'GlimmerBooleanLiteral' &&
    value.path.value === false
  ) {
    return false;
  }
  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate form control names within the same form',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-form-names.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      duplicate: 'Duplicate form control `name="{{name}}"` within the same form',
    },
  },

  create(context) {
    // Per-form: Map<name, entries[]>. Each entry records { type, path } so we
    // can pairwise compare against subsequent occurrences — mutually exclusive
    // branches (different `program`/`inverse` subtrees of the same
    // `{{#if}}`/`{{#unless}}`) never both render, so their same-name
    // "collision" is a false positive.
    const nameMapByForm = new WeakMap();
    const rootMap = new Map();

    function getMapForForm(formNode) {
      if (!formNode) {
        return rootMap;
      }
      let map = nameMapByForm.get(formNode);
      if (!map) {
        map = new Map();
        nameMapByForm.set(formNode, map);
      }
      return map;
    }

    return {
      GlimmerElementNode(node) {
        if (!FORM_CONTROL_TAGS.has(node.tag)) {
          return;
        }
        if (isDisabled(node)) {
          return;
        }
        const nameInfo = getStaticAttrValue(node, 'name');
        if (nameInfo.kind !== 'static' || nameInfo.value === '') {
          return;
        }
        const name = nameInfo.value;
        const type = getControlType(node);
        // Dynamic type (`type={{this.kind}}` / concat) — we can't classify
        // the control's submission behavior. Skip duplicate-name collision
        // checks for this node rather than guessing; false negatives here
        // are safer than false positives on legitimate branches.
        if ((node.tag === 'input' || node.tag === 'button') && type === 'unknown') {
          return;
        }
        // Non-submitting controls contribute nothing to the form-data entry
        // list, so their `name` can't collide with anything.
        if ((node.tag === 'input' || node.tag === 'button') && NON_SUBMITTING_TYPES.has(type)) {
          return;
        }
        const form = findEnclosingFormOrRoot(node);
        const map = getMapForForm(form);
        const path = getBranchPath(node);

        const entries = map.get(name);
        const currCategory = getShareCategory(node.tag, type);

        if (!entries) {
          map.set(name, [{ tag: node.tag, type, path, category: currCategory }]);
          return;
        }

        const collides = entries.some((prev) => {
          // Same share-category (radio group, or any mix of submit-like
          // controls) coexist legitimately — at most one contributes to the
          // form-data entry list per submission.
          if (currCategory !== null && currCategory === prev.category) {
            return false;
          }
          // Mutually exclusive control-flow branches never render together.
          if (areMutuallyExclusive(prev.path, path)) {
            return false;
          }
          return true;
        });

        entries.push({ tag: node.tag, type, path, category: currCategory });

        if (collides) {
          const nameAttr = findAttr(node, 'name');
          context.report({
            node: nameAttr || node,
            messageId: 'duplicate',
            data: { name },
          });
        }
      },
    };
  },
};
