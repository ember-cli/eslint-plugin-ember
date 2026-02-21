/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require (has-block) helper usage instead of hasBlock property',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-has-block-helper.md',
    },
    fixable: null,
    schema: [],
    messages: {
      useHasBlockHelper: 'Use (has-block) helper instead of hasBlock property.',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        if (
          node.original === 'hasBlock' ||
          node.original === 'this.hasBlock' ||
          node.original === 'hasBlockParams' ||
          node.original === 'this.hasBlockParams'
        ) {
          context.report({
            node,
            messageId: 'useHasBlockHelper',
          });
        }
      },
    };
  },
};
