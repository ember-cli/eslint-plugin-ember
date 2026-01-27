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
