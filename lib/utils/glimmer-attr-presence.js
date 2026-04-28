'use strict';

const { getStaticAttrValue } = require('./static-attr-value');

// HTML boolean attributes per WHATWG HTML Living Standard
// (https://html.spec.whatwg.org/multipage/indices.html#attributes-3, "Boolean
// attribute" column). Glimmer's bare-mustache falsy-coercion applies to these.
const BOOLEAN_HTML_ATTRS = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'hidden',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
]);

// Numeric attributes whose bare-falsy coercion is verified or expected.
// Verified for `tabindex` (rows t6, t7). `colspan` / `rowspan` follow the same
// numeric-attribute pattern but are not directly verified.
const NUMERIC_ATTRS = new Set(['tabindex', 'colspan', 'rowspan']);

/**
 * Infer the attribute kind from its name. Used when the caller doesn't pass
 * `options.kind` explicitly.
 *
 * Returns one of: 'boolean' | 'aria' | 'numeric' | 'plain-string'.
 *
 * NOTE: `role` is intentionally classified as `'plain-string'` (not `'aria'`)
 * because empirically it does NOT participate in the bare-mustache
 * falsy-coercion list (per cross-attribute observations in the doc — `role`
 * is a plain DOM string attribute despite living conceptually with ARIA).
 */
function inferAttrKind(name) {
  if (BOOLEAN_HTML_ATTRS.has(name)) {
    return 'boolean';
  }
  if (NUMERIC_ATTRS.has(name)) {
    return 'numeric';
  }
  if (name.startsWith('aria-')) {
    return 'aria';
  }
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
  // For plain-string/aria/numeric, the rendered value is the stringified
  // concatenation of parts; if any part is dynamic, value is unknown.
  // For boolean attrs, the IDL property is set true regardless of inner literal
  // (rows m13-m19, d7-d10), so the conceptual "value" is irrelevant for
  // boolean callers — but we still report the resolved string when known so
  // string-comparing callers (e.g., aria-hidden === "true") work for h12-h15.
  if (value.type === 'GlimmerConcatStatement') {
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
    // {{true}}: present on all kinds.
    // For aria-coerced specifically, h5 shows the rendered HTML value is "" —
    // not "true". Callers comparing aria-hidden values to "true" should NOT
    // match this case. Reflect that asymmetry in the resolved value:
    if (kind === 'aria') {
      return { presence: 'present', value: '' };
    }
    // Boolean reflecting (d2: disabled=""), boolean non-reflecting (m5: HTML
    // omitted but IDL true), numeric (untested for {{true}}), plain-string
    // (untested for {{true}}) — for the rule's purposes, the attribute is
    // present and conceptually "true". We surface the literal source value
    // "true" so string-comparing callers behave like for {{"true"}} (m7, h7).
    return { presence: 'present', value: 'true' };
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
  BOOLEAN_HTML_ATTRS,
  NUMERIC_ATTRS,
};
