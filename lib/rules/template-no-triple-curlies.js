/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of triple curly brackets (unescaped variables)',
      category: 'Security',
      recommended: false,
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-triple-curlies.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unsafe:
        'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        // Check if the statement is unescaped (triple curlies)
        // Use 'trusting' property (escaped is deprecated)
        if (node.trusting === true) {
          context.report({
            node,
            messageId: 'unsafe',
          });
        }
      },
    };
  },
};
