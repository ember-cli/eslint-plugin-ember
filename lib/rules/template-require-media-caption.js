/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require captions for audio and video elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-media-caption.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      missingTrack: 'Media elements such as <audio> and <video> must have a <track> for captions.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-media-caption.js',
      docs: 'docs/rule/require-media-caption.md',
      tests: 'test/unit/rules/require-media-caption-test.js',
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

          // Any other dynamic value (e.g. muted="{{isMuted}}" → ConcatStatement,
          // or muted={{#if ...}}...{{/if}} → BlockStatement) → treat as exempt.
          // Matches upstream ember-template-lint behavior where MustacheStatement,
          // BlockStatement, or any non-text/non-"false" value is considered muted.
          if (
            value.type !== 'GlimmerTextNode' &&
            value.type !== 'GlimmerMustacheStatement'
          ) {
            return;
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
          });
        }
      },
    };
  },
};
