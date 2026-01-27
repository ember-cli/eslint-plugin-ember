/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated comparisons in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-negated-comparison.md',
      templateMode: 'both',
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
