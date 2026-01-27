/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of triple curly brackets (unescaped variables)',
      category: 'Security',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-triple-curlies.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      unsafe:
        'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-triple-curlies.js',
      docs: 'docs/rule/no-triple-curlies.md',
      tests: 'test/unit/rules/no-triple-curlies-test.js',
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
