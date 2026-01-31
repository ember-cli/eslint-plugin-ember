/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of {{action}} modifiers',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action-modifiers.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noActionModifier: 'Do not use action modifiers. Use on modifier with a function instead.',
    },
  },

  create(context) {
    function checkForActionModifier(node) {
      // Check if this is an action modifier (not action helper in mustache)
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'action' &&
        node.path.head?.type !== 'AtHead' &&
        node.path.head?.type !== 'ThisHead'
      ) {
        context.report({
          node,
          messageId: 'noActionModifier',
        });
      }
    }

    return {
      GlimmerElementModifierStatement(node) {
        checkForActionModifier(node);
      },
    };
  },
};
