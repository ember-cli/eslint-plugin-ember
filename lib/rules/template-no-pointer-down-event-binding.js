/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow pointer down event bindings',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-pointer-down-event-binding.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Avoid binding to a pointer `down` event; bind to a pointer `up` event instead.',
    },
  },

  create(context) {
    const DOWN_EVENTS = new Set(['mousedown', 'onmousedown', 'pointerdown', 'onpointerdown']);

    function isDownEvent(name) {
      return DOWN_EVENTS.has(name.toLowerCase());
    }

    return {
      GlimmerElementNode(node) {
        // Check for onmousedown/onpointerdown HTML attributes
        if (node.attributes) {
          for (const attr of node.attributes) {
            if (attr.name && attr.name.startsWith('on') && isDownEvent(attr.name)) {
              context.report({ node: attr, messageId: 'unexpected' });
            }
          }
        }

        // Check modifiers: {{on "mousedown"}} and {{action ... on="mousedown"}}
        if (node.modifiers) {
          for (const modifier of node.modifiers) {
            if (modifier.path?.type !== 'GlimmerPathExpression') {
              continue;
            }

            if (modifier.path.original === 'on' && modifier.params?.length > 0) {
              const eventParam = modifier.params[0];
              if (eventParam.type === 'GlimmerStringLiteral' && isDownEvent(eventParam.value)) {
                context.report({ node: modifier, messageId: 'unexpected' });
              }
            }

            if (modifier.path.original === 'action') {
              const onPair = modifier.hash?.pairs?.find((p) => p.key === 'on');
              if (
                onPair &&
                onPair.value?.type === 'GlimmerStringLiteral' &&
                isDownEvent(onPair.value.value)
              ) {
                context.report({ node: modifier, messageId: 'unexpected' });
              }
            }
          }
        }
      },
    };
  },
};
