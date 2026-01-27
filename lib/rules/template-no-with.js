/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{with}} helper',
      category: 'Deprecations',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-with.md',
    },
    schema: [],
    messages: {
      deprecated:
        'The use of `{{with}}` has been deprecated. See https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax',
    },
  },
  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'with') {
          context.report({ node, messageId: 'deprecated' });
        }
      },
    };
  },
};
