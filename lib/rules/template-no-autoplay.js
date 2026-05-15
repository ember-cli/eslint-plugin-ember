'use strict';

// See html-validate (https://html-validate.org/rules/no-autoplay.html) for the peer rule concept.

const DEFAULT_ELEMENTS = new Set(['audio', 'video']);

// Classify an attribute's value as "present at runtime" (truthy), "absent"
// (falsy), or "unknown" (dynamic). See ../../docs/glimmer-attribute-behavior.md
// for the empirical model — short version: only bare-mustache `{{false}}`
// causes Glimmer to omit the attribute. Bare-string literals (incl. `"false"`)
// and any concat form set the IDL property to truthy regardless of the
// literal value inside.
function classifyAttrValue(attr) {
  if (!attr.value) {
    return 'truthy';
  }
  if (attr.value.type === 'GlimmerTextNode') {
    return 'truthy';
  }
  if (attr.value.type === 'GlimmerMustacheStatement' && attr.value.path) {
    const path = attr.value.path;
    if (path.type === 'GlimmerBooleanLiteral') {
      return path.value ? 'truthy' : 'falsy';
    }
    if (path.type === 'GlimmerStringLiteral') {
      return 'truthy';
    }
    return 'unknown';
  }
  if (attr.value.type === 'GlimmerConcatStatement') {
    const parts = attr.value.parts || [];
    const hasDynamicPart = parts.some(
      (part) =>
        part.type === 'GlimmerMustacheStatement' &&
        part.path &&
        part.path.type !== 'GlimmerBooleanLiteral' &&
        part.path.type !== 'GlimmerStringLiteral'
    );
    if (hasDynamicPart) {
      return 'unknown';
    }
    return 'truthy';
  }
  return 'truthy';
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow autoplay attribute on audio and video elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-autoplay.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          additionalElements: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noAutoplay:
        'The `autoplay` attribute is disruptive for users and has accessibility concerns on `<{{tag}}>`',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const extraElements = new Set(options.additionalElements || []);
    const watched = new Set([...DEFAULT_ELEMENTS, ...extraElements]);

    return {
      GlimmerElementNode(node) {
        if (!watched.has(node.tag)) {
          return;
        }
        const autoplayAttr = node.attributes?.find((attr) => attr.name === 'autoplay');
        if (!autoplayAttr) {
          return;
        }
        const classification = classifyAttrValue(autoplayAttr);
        if (classification === 'falsy' || classification === 'unknown') {
          return;
        }
        // <video muted> is outside WCAG SC 1.4.2's audio-output scope (W3C ACT
        // rule aaa1bf), so a muted autoplaying video is not an SC 1.4.2
        // failure. Unknown mustache values for `muted` also skip, consistent
        // with the rule's "false positives are worse than false negatives"
        // stance. Limited to <video>: <audio muted autoplay> is
        // spec-nonsensical, and additionalElements are opt-in user-land tags
        // whose semantics we don't know.
        if (node.tag === 'video') {
          const mutedAttr = node.attributes?.find((attr) => attr.name === 'muted');
          if (mutedAttr && classifyAttrValue(mutedAttr) !== 'falsy') {
            return;
          }
        }
        context.report({
          node: autoplayAttr,
          messageId: 'noAutoplay',
          data: { tag: node.tag },
        });
      },
    };
  },
};
