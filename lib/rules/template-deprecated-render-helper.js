/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{render}} helper',
      category: 'Deprecations',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-deprecated-render-helper.md',
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated:
        'The `{{render}}` helper is deprecated in favor of using components. See https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper',
    },
  },

  create(context) {
    function checkForRender(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'render'
      ) {
        context.report({
          node,
          messageId: 'deprecated',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForRender(node);
      },

      GlimmerBlockStatement(node) {
        checkForRender(node);
      },
    };
  },
};
