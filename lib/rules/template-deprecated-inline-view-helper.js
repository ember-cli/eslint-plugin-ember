/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline {{view}} helper',
      category: 'Deprecations',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-deprecated-inline-view-helper.md',
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated:
        'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
    },
  },

  create(context) {
    function checkForView(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'view'
      ) {
        // Check if it has hash pairs (attributes), which indicates inline usage
        if (node.hash && node.hash.pairs && node.hash.pairs.length > 0) {
          context.report({
            node,
            messageId: 'deprecated',
          });
        }
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForView(node);
      },

      GlimmerBlockStatement(node) {
        checkForView(node);
      },
    };
  },
};
