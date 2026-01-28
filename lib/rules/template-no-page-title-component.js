/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of ember-page-title component',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-page-title-component.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noPageTitle: 'Use the (page-title) helper instead of <PageTitle> component.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag === 'PageTitle') {
          context.report({
            node,
            messageId: 'noPageTitle',
          });
        }
      },
    };
  },
};
