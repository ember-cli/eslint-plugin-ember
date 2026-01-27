/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{outlet}} outside of route templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-outlet-outside-routes.md',
    },
    schema: [],
    messages: {
      noOutletOutsideRoutes: 'outlet should only be used in route templates.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'outlet') {
          context.report({
            node,
            messageId: 'noOutletOutsideRoutes',
          });
        }
      },
    };
  },
};
