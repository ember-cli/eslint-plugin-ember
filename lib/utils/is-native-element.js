'use strict';

const htmlTags = require('html-tags');
const svgTags = require('svg-tags');
const { mathmlTagNames } = require('mathml-tag-names');

// Authoritative set of native element tag names. Mirrors the approach
// established by #2689 (template-no-block-params-for-html-elements), which
// the maintainer requires for component-vs-element discrimination in this
// plugin. Heuristic approaches (PascalCase detection, etc.) were explicitly
// rejected there because a lowercase tag CAN be a component in GJS/GTS when
// the name is bound in scope (e.g. `const div = MyComponent; <div />`).
const ELEMENT_TAGS = new Set([...htmlTags, ...svgTags, ...mathmlTagNames]);

/**
 * Returns true if the Glimmer element node is a native HTML / SVG / MathML
 * element — i.e. the tag name is in the authoritative list AND is not
 * shadowed by an in-scope binding.
 *
 * "Native" here means **spec-registered tag name** (in the HTML, SVG, or
 * MathML spec registries, reached via the `html-tags` / `svg-tags` /
 * `mathml-tag-names` packages). It is NOT the same as:
 *
 *  - "native accessibility" / "widget-ness" — see `interactive-roles.js`
 *    (aria-query widget taxonomy; an ARIA-tree-semantics question)
 *  - "native interactive content" / "focus behavior" — see
 *    `html-interactive-content.js` (HTML §3.2.5.2.7; an HTML-content-model
 *    question about which tags can be nested inside what)
 *  - "natively focusable" / sequential-focus — see HTML §6.6.3
 *
 * This util answers only: "is this tag a first-class built-in element of one
 * of the three markup-language standards, rather than a component invocation
 * or a shadowed local binding?" Callers compose it with the other utils
 * above when they need a more specific question (see e.g. `template-no-
 * noninteractive-tabindex`, which consults both this and
 * `html-interactive-content`).
 *
 * Returns false for:
 *  - components (PascalCase, dotted, @-prefixed, this.-prefixed, ::-namespaced —
 *    none of these tag names appear in the HTML/SVG/MathML lists)
 *  - custom elements (`<my-widget>`) — accepted false negative; the web-
 *    components namespace is open and can't be enumerated
 *  - scope-bound identifiers (`<div>` when `div` is a local `let` / `const` /
 *    import / block-param in the enclosing scope)
 *
 * @param {object} node - GlimmerElementNode
 * @param {object} [sourceCode] - ESLint SourceCode, for scope lookup. When
 *   omitted, the scope check is skipped (the result is then list-based only —
 *   suitable for unit tests).
 */
function isNativeElement(node, sourceCode) {
  if (!node || typeof node.tag !== 'string') {
    return false;
  }
  if (!ELEMENT_TAGS.has(node.tag)) {
    return false;
  }
  if (!sourceCode || !node.parent) {
    return true;
  }
  const scope = sourceCode.getScope(node.parent);
  const firstPart = node.parts && node.parts[0];
  if (firstPart && scope.references.some((ref) => ref.identifier === firstPart)) {
    return false;
  }
  return true;
}

/**
 * Inverse of {@link isNativeElement}. Returns true when the node should NOT
 * be treated as a native HTML element — either because it's a component
 * invocation (PascalCase, dotted, @-prefixed, this.-prefixed, custom element)
 * OR a tag name that's shadowed by a scope binding.
 */
function isComponentInvocation(node, sourceCode) {
  return !isNativeElement(node, sourceCode);
}

module.exports = { isNativeElement, isComponentInvocation, ELEMENT_TAGS };
