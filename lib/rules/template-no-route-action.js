/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of route-action helper',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-route-action.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
    },
  },

  create(context) {
    function checkForRouteAction(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'route-action'
      ) {
        context.report({
          node,
          messageId: 'unexpected',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForRouteAction(node);
      },

      GlimmerSubExpression(node) {
        checkForRouteAction(node);
      },
    };
  },
};
