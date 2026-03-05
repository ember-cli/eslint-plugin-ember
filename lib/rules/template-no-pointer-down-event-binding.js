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
    return {
      GlimmerElementNode(node) {
        // Check for onpointerdown attribute
        const pointerDownAttr = node.attributes?.find((a) => a.name === 'onpointerdown');
        if (pointerDownAttr) {
          context.report({
            node: pointerDownAttr,
            messageId: 'unexpected',
          });
        }

        // Check for {{on "pointerdown"}} modifier
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
                eventParam.value === 'pointerdown'
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
