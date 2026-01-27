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
      unexpected:
        'Avoid pointer down events. Use click or keydown events instead for better accessibility.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-pointer-down-event-binding.js',
      docs: 'docs/rule/no-pointer-down-event-binding.md',
      tests: 'test/unit/rules/no-pointer-down-event-binding-test.js',
    },
  },

  create(context) {
    const POINTER_DOWN_EVENTS = new Set(['pointerdown', 'mousedown']);
    const POINTER_DOWN_ATTRS = new Set(['onpointerdown', 'onmousedown']);

    return {
      GlimmerElementNode(node) {
        // Check for onpointerdown/onmousedown attributes
        for (const attr of node.attributes || []) {
          if (POINTER_DOWN_ATTRS.has(attr.name)) {
            context.report({
              node: attr,
              messageId: 'unexpected',
            });
          }
        }

        // Check for {{on "pointerdown"/"mousedown"}} and {{action ... on="mousedown"}} modifiers
        if (node.modifiers) {
          for (const modifier of node.modifiers) {
            if (
              modifier.path?.type === 'GlimmerPathExpression' &&
              modifier.path.original === 'on' &&
              modifier.params?.length > 0
            ) {
              const eventParam = modifier.params[0];
              if (
                eventParam.type === 'GlimmerStringLiteral' &&
                POINTER_DOWN_EVENTS.has(eventParam.value)
              ) {
                context.report({
                  node: modifier,
                  messageId: 'unexpected',
                });
              }
            }

            // Check {{action ... on="mousedown"/"pointerdown"}}
            if (
              modifier.path?.type === 'GlimmerPathExpression' &&
              modifier.path.original === 'action'
            ) {
              const onPair = modifier.hash?.pairs?.find((p) => p.key === 'on');
              if (
                onPair &&
                onPair.value?.type === 'GlimmerStringLiteral' &&
                POINTER_DOWN_EVENTS.has(onPair.value.value)
              ) {
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
