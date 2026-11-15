'use strict';

const { find, html } = require('property-information');
const { getStaticAttrValue } = require('./static-attr-value');

// `colspan` is a positive-integer attribute per WHATWG, but property-information
// 7.1.0 doesn't mark it as `number: true` (likely upstream gap — `rowspan`,
// `cols`, etc. do have it). Override locally; remove if upstream fixes.
const NUMERIC_OVERRIDES = new Set(['colspan']);

/**
 * Infer the attribute kind from its name. Used when the caller doesn't pass
 * `options.kind` explicitly.
 *
 * Returns one of: 'boolean' | 'aria' | 'numeric' | 'plain-string'.
 *
 * Classification flows from the `property-information` package, which encodes
 * attribute type info per WHATWG HTML / WAI-ARIA. ARIA prefix is checked first
 * because Glimmer's rendering for `aria-*` attrs diverges from HTML booleans
 * (e.g., `aria-hidden={{true}}` renders empty per h5, but `disabled={{true}}`
 * renders `disabled=""` per d2). `role` falls through to plain-string because
 * Glimmer does not falsy-coerce it (the doc's cross-attribute observations
 * confirm this — `role={{false}}` renders `role="false"`).
 */
function inferAttrKind(name) {
  // HTML attribute names are case-insensitive; normalize before lookup so
  // `Disabled`, `ARIA-Hidden`, etc. classify the same as the lowercase form.
  const lower = name.toLowerCase();
  if (lower.startsWith('aria-')) {
    return 'aria';
  }
  const info = find(html, lower);
  // boolean: standard HTML boolean attrs (disabled, muted, …).
  // overloadedBoolean: hidden, download — boolean-like with extra string values,
  // but Glimmer's falsy-omit coercion still applies (verified for `hidden`-style).
  if (info.boolean || info.overloadedBoolean) {
    return 'boolean';
  }
  if (info.number || NUMERIC_OVERRIDES.has(lower)) {
    return 'numeric';
  }
  // Everything else (plain strings, booleanish HTML attrs like contenteditable
  // and draggable whose Glimmer behavior isn't verified in the doc) routes to
  // plain-string. Conservative: no falsy-omit coercion, render the literal.
  return 'plain-string';
}

/**
 * Classify a Glimmer attribute against the verified rendering model in
 * docs/glimmer-attribute-behavior.md.
 *
 * Result shape: { presence, value }
 *
 *   presence: 'absent' | 'present' | 'unknown'
 *     - 'absent'  — attribute will not be on the rendered element.
 *                   Either attrNode is null/undefined, OR the source is
 *                   bare {{false}}/{{null}}/{{undefined}} (or {{0}} for
 *                   `boolean` kind) on a falsy-coerced attribute kind
 *                   (boolean / aria / numeric). Doc rows: m6, m9, m10, m12,
 *                   d3, d6, h6, h9, h10, t6, t7.
 *     - 'present' — attribute will be present at runtime. `value` is the
 *                   resolved static string when known, or null when the
 *                   value is dynamic (e.g., bare {{this.x}} on a plain-string
 *                   attribute).
 *     - 'unknown' — cannot determine statically (dynamic mustache / dynamic
 *                   concat part on a falsy-coerced kind, since the runtime
 *                   value could be falsy and thus omit the attribute).
 *
 *   value: string | null
 *     The resolved HTML attribute value when statically known. null when:
 *       - presence is 'absent' or 'unknown'
 *       - presence is 'present' but the value is dynamic
 *
 * @param {object|null|undefined} attrNode - The AttrNode, or null/undefined when not found.
 * @param {object} [options]
 * @param {'boolean'|'aria'|'numeric'|'plain-string'} [options.kind] - Override inferred kind.
 * @returns {{presence: 'absent'|'present'|'unknown', value: string|null}}
 */
function classifyAttribute(attrNode, options = {}) {
  if (!attrNode) {
    return { presence: 'absent', value: null };
  }

  const kind = options.kind || inferAttrKind(attrNode.name);
  const isFalsyCoerced = kind === 'boolean' || kind === 'aria' || kind === 'numeric';
  const value = attrNode.value;

  // Valueless attribute: <input disabled />, <div aria-hidden></div>
  // Renders as `attr=""`. Doc rows: d1, h1.
  if (value === null || value === undefined) {
    return { presence: 'present', value: '' };
  }

  // Static text: attr="anything". Renders the literal chars.
  // Doc rows: m1-m4, h2-h4, d1, t-static, i1.
  if (value.type === 'GlimmerTextNode') {
    return { presence: 'present', value: value.chars };
  }

  // Bare-mustache: attr={{X}}
  if (value.type === 'GlimmerMustacheStatement') {
    return classifyBareMustache(value, kind, isFalsyCoerced);
  }

  // Concat-mustache: attr="...{{X}}..." — never falsy.
  // Doc cross-attribute observation: "Concat is never falsy."
  if (value.type === 'GlimmerConcatStatement') {
    // For boolean attrs, the IDL property is set true regardless of inner
    // literal (rows m13–m19, d7–d10). Report the canonical "on" value so
    // callers comparing `value === 'false'` to detect "off" don't get a
    // wrong answer from the inner literal of `attr="{{false}}"`.
    if (kind === 'boolean') {
      return { presence: 'present', value: 'true' };
    }
    // For aria/numeric/plain-string, the rendered HTML value is the
    // stringified concatenation of parts (h12–h15, i3, i5). If any part
    // is dynamic, the resolved value is unknown but presence is still 'present'.
    const resolved = getStaticAttrValue(value);
    return { presence: 'present', value: resolved === undefined ? null : resolved };
  }

  // Unknown AST shape (e.g., a future Glimmer node type) — be conservative.
  return { presence: 'unknown', value: null };
}

function classifyBareMustache(value, kind, isFalsyCoerced) {
  const path = value.path;
  if (!path) {
    return { presence: 'unknown', value: null };
  }

  // {{true}} / {{false}}
  if (path.type === 'GlimmerBooleanLiteral') {
    if (path.value === false) {
      // {{false}} on falsy-coerced kind → omitted (m6, d3, h6, t6 verified).
      // {{false}} on plain-string → renders "false" (i4 verified for autocomplete).
      if (isFalsyCoerced) {
        return { presence: 'absent', value: null };
      }
      return { presence: 'present', value: 'false' };
    }
    // {{true}}: behavior diverges by kind.
    //   - boolean: verified (m5, d2). HTML may be empty (d2) or omitted (m5),
    //     but the attribute is conceptually "on". Surface 'true' so callers
    //     can string-compare like for {{"true"}}.
    //   - aria: verified (h5). Renders aria-hidden="" — empty, NOT "true".
    //     Callers comparing aria-hidden to "true" must not match this row.
    //   - numeric / plain-string: untested in the verification doc. Be
    //     conservative — return 'unknown' rather than guess.
    if (kind === 'boolean') {
      return { presence: 'present', value: 'true' };
    }
    if (kind === 'aria') {
      return { presence: 'present', value: '' };
    }
    return { presence: 'unknown', value: null };
  }

  // {{null}} / {{undefined}}
  if (path.type === 'GlimmerNullLiteral' || path.type === 'GlimmerUndefinedLiteral') {
    // Verified for falsy-coerced kinds via cross-attribute observation
    // (rows m9, m10, h9, h10, d6, t7).
    // For plain-string, behavior is not yet verified — return 'unknown' to
    // avoid claiming behavior the doc doesn't guarantee.
    if (isFalsyCoerced) {
      return { presence: 'absent', value: null };
    }
    return { presence: 'unknown', value: null };
  }

  // {{"string"}}
  // Bare-mustache string literals never coerce — render literal value.
  // Doc rows: m7, m8, h7, h8, d4, d5, i2.
  if (path.type === 'GlimmerStringLiteral') {
    return { presence: 'present', value: path.value };
  }

  // {{0}}, {{1}}, {{-1}}, etc.
  if (path.type === 'GlimmerNumberLiteral') {
    // {{0}} for boolean kind → omitted (m12 verified for muted).
    // For numeric kind, t1 verifies {{0}} renders "0" (focusable).
    // For plain-string, untested.
    if (path.value === 0 && kind === 'boolean') {
      return { presence: 'absent', value: null };
    }
    return { presence: 'present', value: String(path.value) };
  }

  // Dynamic path: {{this.x}}, {{x}}, {{(some-helper)}}, etc.
  // For falsy-coerced kinds, runtime value could be falsy → attribute omitted.
  // For plain-string, the attribute renders something (even null/undefined coerce
  // via stringification), but the value isn't statically known.
  if (isFalsyCoerced) {
    return { presence: 'unknown', value: null };
  }
  return { presence: 'present', value: null };
}

module.exports = {
  classifyAttribute,
  inferAttrKind,
};
