/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow mouse down event bindings',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-down-event-binding.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Avoid mousedown/touchstart events. Use click or keydown events instead for better accessibility.',
    },
  },

  create(context) {
    const DOWN_EVENTS = new Set(['mousedown', 'touchstart']);

    return {
      GlimmerElementNode(node) {
        // Check for onmousedown/ontouchstart attributes
        if (node.attributes) {
          for (const attr of node.attributes) {
            if (attr.name && DOWN_EVENTS.has(attr.name.replace('on', ''))) {
              context.report({
                node: attr,
                messageId: 'unexpected',
              });
            }
          }
        }

        // Check for {{on "mousedown"}} or {{on "touchstart"}} modifiers
        if (node.modifiers) {
          for (const modifier of node.modifiers) {
            if (
              modifier.path?.type === 'GlimmerPathExpression' &&
              modifier.path.original === 'on' &&
              modifier.params?.length > 0
            ) {
              const eventParam = modifier.params[0];
              if (eventParam.type === 'GlimmerStringLiteral' && DOWN_EVENTS.has(eventParam.value)) {
                context.report({
                  node: modifier,
                  messageId: 'unexpected',
                });
              }
            }
          }
        }
      },
    };
  },
};
