'use strict';

// See html-validate (https://html-validate.org/rules/no-autoplay.html) for the peer rule concept.

const DEFAULT_ELEMENTS = new Set(['audio', 'video']);

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
      return path.value.toLowerCase() === 'false' ? 'falsy' : 'truthy';
    }
    return 'unknown';
  }
  if (attr.value.type === 'GlimmerConcatStatement') {
    // Quoted-mustache form like autoplay="{{dynamic}}" or autoplay="foo{{bar}}".
    // If any mustache part is a dynamic path (not a boolean/string literal),
    // we can't know the runtime value — classify as unknown.
    const parts = attr.value.parts || [];
    const hasUnknownPart = parts.some(
      (part) =>
        part.type === 'GlimmerMustacheStatement' &&
        part.path &&
        part.path.type !== 'GlimmerBooleanLiteral' &&
        part.path.type !== 'GlimmerStringLiteral'
    );
    if (hasUnknownPart) {
      return 'unknown';
    }
    // All parts are static (text or literal mustaches). For a boolean-style
    // HTML attribute like `autoplay`, the presence of any static content
    // means the attribute is truthy — except when the entire concat resolves
    // to the string "false" via a single `{{false}}` or `{{"false"}}` part.
    if (parts.length === 1 && parts[0].type === 'GlimmerMustacheStatement') {
      const path = parts[0].path;
      if (path.type === 'GlimmerBooleanLiteral') {
        return path.value ? 'truthy' : 'falsy';
      }
      if (path.type === 'GlimmerStringLiteral') {
        return path.value.toLowerCase() === 'false' ? 'falsy' : 'truthy';
      }
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
