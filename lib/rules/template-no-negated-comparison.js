/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated comparisons in templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-negated-comparison.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noNegatedComparison: 'Use positive comparison operators instead of negated ones.',
    },
  },

  create(context) {
    return {
      GlimmerSubExpression(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          (node.path.original === 'not-eq' || node.path.original === 'ne')
        ) {
          context.report({
            node,
            messageId: 'noNegatedComparison',
          });
        }
      },
    };
  },
};
