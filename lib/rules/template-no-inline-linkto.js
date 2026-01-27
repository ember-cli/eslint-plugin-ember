/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline form of LinkTo component',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-linkto.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noInlineLinkTo: 'Use block form of LinkTo component instead of inline form.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag === 'LinkTo' && node.children && node.children.length === 0) {
          context.report({
            node,
            messageId: 'noInlineLinkTo',
          });
        }
      },
    };
  },
};
