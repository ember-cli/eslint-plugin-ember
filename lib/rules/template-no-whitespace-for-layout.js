/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using whitespace for layout purposes',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-whitespace-for-layout.md',
    },
    schema: [],
    messages: {
      noWhitespaceForLayout:
        'Unexpected use of whitespace for layout. Use CSS for spacing instead of multiple spaces.',
    },
  },

  create(context) {
    return {
      GlimmerTextNode(node) {
        const text = node.chars;
        // Check for multiple consecutive spaces (3 or more)
        if (text && /\s{3,}/.test(text)) {
          context.report({
            node,
            messageId: 'noWhitespaceForLayout',
          });
        }
      },
    };
  },
};
