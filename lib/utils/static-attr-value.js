'use strict';

/**
 * Return the statically-known string value of a Glimmer attribute value node,
 * or `undefined` when the value is dynamic (cannot be resolved at lint time).
 *
 * Unwraps:
 *   - GlimmerTextNode → chars
 *   - GlimmerMustacheStatement with a literal path (boolean/string/number) → stringified value
 *   - GlimmerConcatStatement whose parts are all statically resolvable → joined string
 *
 * A missing/undefined value (valueless attribute, e.g. `<input disabled>`)
 * returns the empty string. Pass `attr.value` — not the attribute itself.
 */
function getStaticAttrValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (value.type === 'GlimmerTextNode') {
    return value.chars;
  }
  if (value.type === 'GlimmerMustacheStatement') {
    return extractLiteral(value.path);
  }
  if (value.type === 'GlimmerConcatStatement') {
    const parts = value.parts || [];
    let out = '';
    for (const part of parts) {
      if (part.type === 'GlimmerTextNode') {
        out += part.chars;
        continue;
      }
      if (part.type === 'GlimmerMustacheStatement') {
        const literal = extractLiteral(part.path);
        if (literal === undefined) {
          return undefined;
        }
        out += literal;
        continue;
      }
      return undefined;
    }
    return out;
  }
  return undefined;
}

function extractLiteral(path) {
  if (!path) {
    return undefined;
  }
  if (path.type === 'GlimmerBooleanLiteral') {
    return path.value ? 'true' : 'false';
  }
  if (path.type === 'GlimmerStringLiteral') {
    return path.value;
  }
  if (path.type === 'GlimmerNumberLiteral') {
    return String(path.value);
  }
  return undefined;
}

module.exports = { getStaticAttrValue };
