/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow @args in paths',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-args-paths.md',
    },
    schema: [],
    messages: { argsPath: 'Do not use paths with @args, use @argName directly instead.' },
  },
  create(context) {
    return {
      GlimmerPathExpression(node) {
        if (node.original?.startsWith('@args.')) {
          context.report({ node, messageId: 'argsPath' });
        }
      },
    };
  },
};
