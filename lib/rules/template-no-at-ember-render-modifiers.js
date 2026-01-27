/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of @ember/render-modifiers',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-at-ember-render-modifiers.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noRenderModifiers:
        'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!node.modifiers) {
          return;
        }

        for (const modifier of node.modifiers) {
          if (
            modifier.path &&
            modifier.path.type === 'GlimmerPathExpression' &&
            (modifier.path.original === 'did-insert' ||
              modifier.path.original === 'did-update' ||
              modifier.path.original === 'will-destroy')
          ) {
            context.report({
              node: modifier,
              messageId: 'noRenderModifiers',
            });
          }
        }
      },
    };
  },
};
