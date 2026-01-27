/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline form of LinkTo component',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-linkto.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noInlineLinkTo: 'Use block form of LinkTo component instead of inline form.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/inline-link-to.js',
      docs: 'docs/rule/inline-link-to.md',
      tests: 'test/unit/rules/inline-link-to-test.js',
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
