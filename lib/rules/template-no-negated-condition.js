/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated conditions in if/unless',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-negated-condition.md',
    },
    schema: [],
    messages: {
      noNegatedCondition: 'Unexpected negated condition. Use unless helper or rewrite condition.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'if') {
          const firstParam = node.params[0];
          if (
            firstParam &&
            firstParam.type === 'GlimmerSubExpression' &&
            firstParam.path.type === 'GlimmerPathExpression' &&
            firstParam.path.original === 'not'
          ) {
            context.report({
              node: firstParam,
              messageId: 'noNegatedCondition',
            });
          }
        }
      },
    };
  },
};
