/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require captions for audio and video elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-media-caption.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingTrack: 'Media elements (<{{tag}}>) must have a <track> element with kind="captions".',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'audio' && node.tag !== 'video') {
          return;
        }

        // Check if the element has a muted attribute that exempts it
        const mutedAttr = node.attributes?.find((a) => a.name === 'muted');
        if (mutedAttr) {
          // muted with no value (boolean attribute like <video muted>) → valid
          if (!mutedAttr.value) {
            return;
          }

          const value = mutedAttr.value;

          // muted="true" or any string other than "false" → valid
          if (value.type === 'GlimmerTextNode' && value.chars !== 'false') {
            return;
          }

          // muted={{expr}} → valid (dynamic), unless it's a literal false (muted=false)
          if (value.type === 'GlimmerMustacheStatement') {
            const expr = value.path;
            // muted=false → BooleanLiteral(false) → NOT muted, continue checking
            if (expr?.type === 'GlimmerBooleanLiteral' && expr.value === false) {
              // fall through to caption check
            } else {
              return;
            }
          }
        }

        // Check if there's a track element with kind="captions" as a child
        const hasCaption = node.children?.some((child) => {
          if (child.type !== 'GlimmerElementNode' || child.tag !== 'track') {
            return false;
          }

          const kindAttr = child.attributes?.find((a) => a.name === 'kind');
          if (!kindAttr) {
            return false;
          }

          if (kindAttr.value?.type === 'GlimmerTextNode') {
            return kindAttr.value.chars === 'captions';
          }

          return false;
        });

        if (!hasCaption) {
          context.report({
            node,
            messageId: 'missingTrack',
            data: { tag: node.tag },
          });
        }
      },
    };
  },
};
