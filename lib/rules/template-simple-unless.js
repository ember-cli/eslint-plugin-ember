/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require simple conditions in unless blocks',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-simple-unless.md',
    },
    schema: [],
    messages: {
      simpleUnless:
        'unless blocks should use simple conditions. Use if with negated condition for complex logic.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'unless') {
          if (node.params.length > 0) {
            const firstParam = node.params[0];
            if (firstParam.type === 'GlimmerSubExpression') {
              context.report({
                node: firstParam,
                messageId: 'simpleUnless',
              });
            }
          }
        }
      },
    };
  },
};
