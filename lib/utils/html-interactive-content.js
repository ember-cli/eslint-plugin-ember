'use strict';

/**
 * HTML "interactive content" classification, authoritative per
 * [HTML Living Standard §3.2.5.2.7 Interactive content]
 * (https://html.spec.whatwg.org/multipage/dom.html#interactive-content):
 *
 *   a (if the href attribute is present), audio (if the controls attribute
 *   is present), button, details, embed, iframe, img (if the usemap
 *   attribute is present), input (if the type attribute is not in the
 *   Hidden state), label, select, textarea, video (if the controls
 *   attribute is present).
 *
 * Plus <summary>, which is not in §3.2.5.2.7 but is keyboard-activatable per
 * [§4.11.2 The summary element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element).
 *
 * This is the HTML-content-model authority — it answers "does the HTML spec
 * prohibit nesting this inside an interactive parent?" It does NOT answer
 * "is this an ARIA widget for AT semantics?" (see `interactive-roles.js`
 * for that). The two questions diverge on rows like <label> (HTML: yes;
 * ARIA: structure role), <canvas> (HTML: no; ARIA: widget per axobject),
 * and <option>/<datalist> (HTML: no; ARIA: widgets). Rules that need
 * "interactive for any reason" should compose both authorities.
 */

const UNCONDITIONAL_INTERACTIVE_TAGS = new Set([
  'button',
  'details',
  'embed',
  'iframe',
  'label',
  'select',
  'summary',
  'textarea',
]);

/**
 * Determine whether a Glimmer element node is HTML-interactive content per
 * §3.2.5.2.7 (+ summary).
 *
 * @param {object} node                 Glimmer ElementNode (has a string `tag`).
 * @param {Function} getTextAttrValue   Helper (node, attrName) -> string | undefined
 *                                      returning the static text value of an
 *                                      attribute, or undefined for dynamic / missing.
 * @param {object} [options]
 * @param {boolean} [options.ignoreUsemap=false]  Treat `<img usemap>` as NOT interactive.
 *                                                Consumed by rules with an `ignoreUsemap`
 *                                                config option that lets authors opt out
 *                                                of image-map-based interactivity.
 * @returns {boolean}
 */
function isHtmlInteractiveContent(node, getTextAttrValue, options = {}) {
  const rawTag = node && node.tag;
  if (typeof rawTag !== 'string' || rawTag.length === 0) {
    return false;
  }
  const tag = rawTag.toLowerCase();

  if (UNCONDITIONAL_INTERACTIVE_TAGS.has(tag)) {
    return true;
  }

  // input — interactive unless type="hidden"
  if (tag === 'input') {
    const type = getTextAttrValue(node, 'type');
    return type === undefined || type === null || type.trim().toLowerCase() !== 'hidden';
  }

  // a — interactive only when href is present
  if (tag === 'a') {
    return hasAttribute(node, 'href');
  }

  // img — interactive only when usemap is present (image map)
  if (tag === 'img') {
    if (options.ignoreUsemap) {
      return false;
    }
    return hasAttribute(node, 'usemap');
  }

  // audio / video — interactive only when controls is present
  if (tag === 'audio' || tag === 'video') {
    return hasAttribute(node, 'controls');
  }

  return false;
}

function hasAttribute(node, name) {
  return Boolean(node.attributes && node.attributes.some((a) => a.name === name));
}

module.exports = { isHtmlInteractiveContent };
