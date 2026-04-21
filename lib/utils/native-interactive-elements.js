'use strict';

/**
 * Native-interactive HTML element classification, shared across rules that need to
 * ask "does this HTML tag natively expose interactive UI to keyboard / AT users?".
 *
 * Hand-curated rather than derived directly from axobject-query because
 * axobject-query disagrees with browser reality on several rows (notably
 * audio/video where axobject-query marks them unconditionally widget, but
 * browsers only render keyboard UI when `controls` is set). Decision
 * rationale is documented per-tag:
 *
 * | Element                                  | Behavior             | Rationale                                                                                     |
 * |------------------------------------------|----------------------|-----------------------------------------------------------------------------------------------|
 * | button, select, textarea, embed, summary | Interactive          | axobject-query widget; universally accepted.                                                  |
 * | iframe                                   | Interactive          | axobject-query types it `window` (not widget), but iframe IS focusable and delegates focus.   |
 * | details                                  | Interactive          | axobject-query types it `structure`, but <details> is a keyboard-activatable disclosure.      |
 * | input (except type=hidden)               | Interactive          | axobject-query widget for every type except `hidden` (which has no entry).                    |
 * | option, datalist                         | Interactive          | axobject-query widget (ListBoxOptionRole / ListBoxRole).                                      |
 * | canvas                                   | Interactive          | axobject-query widget (CanvasRole); convention + no-false-positive bias.                      |
 * | a[href], area[href]                      | Interactive (cond.)  | HTML-AAM: anchor interactivity requires href. (area has no axobject-query entry — pragmatic.) |
 * | audio[controls], video[controls]         | Interactive          | Stricter than axobject-query (which marks bare audio/video as widget). Browsers only render   |
 * |                                          |                      | keyboard-operable UI when `controls` is present.                                              |
 * | audio, video (no controls)               | NOT interactive      | Matches browser behavior; axobject-query would disagree here.                                 |
 * | input[type=hidden]                       | NOT interactive      | HTML spec: no UI, no focus, no AT exposure. axobject-query has no entry.                      |
 * | menuitem                                 | NOT interactive      | Deprecated HTML; removed from all major browsers despite axobject-query still listing it.     |
 * | label                                    | NOT interactive      | axobject-query LabelRole is structure, not widget.                                            |
 * | object                                   | NOT interactive      | axobject-query has no entry for <object>; no authoritative source backs "interactive by default." |
 */

// Unconditionally-interactive HTML tags (no attribute dependencies).
const UNCONDITIONAL_INTERACTIVE_TAGS = new Set([
  'button',
  'select',
  'textarea',
  'iframe',
  'embed',
  'summary',
  'details',
  'option',
  'datalist',
  'canvas',
]);

/**
 * Determine whether a Glimmer element node represents a natively-interactive
 * HTML element.
 *
 * @param {object} node                 Glimmer `ElementNode` (has a string `tag`).
 * @param {Function} getTextAttrValue   Helper (node, attrName) -> string | undefined
 *                                      that returns the text value of a static
 *                                      attribute, or undefined for dynamic / missing.
 * @returns {boolean}                   True if the element is natively interactive.
 */
function isNativeInteractive(node, getTextAttrValue) {
  const rawTag = node && node.tag;
  if (typeof rawTag !== 'string' || rawTag.length === 0) {
    return false;
  }
  const tag = rawTag.toLowerCase();

  // Unconditional interactive tags.
  if (UNCONDITIONAL_INTERACTIVE_TAGS.has(tag)) {
    return true;
  }

  // <input> is interactive unless type="hidden" (HTML spec: no UI/focus/AT exposure).
  if (tag === 'input') {
    const type = getTextAttrValue(node, 'type');
    return type !== 'hidden';
  }

  // <a> and <area> are interactive only when an href is present (HTML-AAM).
  if (tag === 'a' || tag === 'area') {
    return hasAttribute(node, 'href');
  }

  // <audio>/<video> are only interactive when `controls` is present.
  if (tag === 'audio' || tag === 'video') {
    return hasAttribute(node, 'controls');
  }

  return false;
}

function hasAttribute(node, name) {
  return Boolean(node.attributes && node.attributes.some((a) => a.name === name));
}

module.exports = {
  isNativeInteractive,
};
