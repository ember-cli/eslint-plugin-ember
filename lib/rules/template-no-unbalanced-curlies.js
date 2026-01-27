/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unbalanced mustache curlies',
      category: 'Possible Errors',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unbalanced-curlies.md',
    },
    schema: [],
    messages: {
      noUnbalancedCurlies:
        'Unbalanced mustache curlies detected. This may indicate a syntax error.',
    },
  },

  create(context) {
    return {
      GlimmerTemplate(node) {
        const sourceCode = context.sourceCode || context.getSourceCode();
        const text = sourceCode.getText(node);

        // Count opening and closing curlies
        // Note: The parser typically catches unbalanced curlies before rules run
        // This serves as a safety check for edge cases
        // eslint-disable-next-line unicorn/better-regex -- need to escape braces
        const openingCount = (text.match(/\{\{/g) || []).length;
        // eslint-disable-next-line unicorn/better-regex -- need to escape braces
        const closingCount = (text.match(/\}\}/g) || []).length;

        if (openingCount !== closingCount) {
          context.report({
            node,
            messageId: 'noUnbalancedCurlies',
          });
        }
      },
    };
  },
};
