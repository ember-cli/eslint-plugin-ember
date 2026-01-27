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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-whitespace-for-layout.js',
      docs: 'docs/rule/no-whitespace-for-layout.md',
      tests: 'test/unit/rules/no-whitespace-for-layout-test.js',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      GlimmerTextNode(node) {
        const text = sourceCode.getText(node);
        if (!text) {
          return;
        }

        const lines = text.split('\n');
        for (const line of lines) {
          // Ignore whitespace at the start and end of the line
          const trimmed = line.trim();

          // Check for two consecutive ` ` or `&nbsp;` in a row
          if (/(( )|(&nbsp;))(( )|(&nbsp;))/.test(trimmed)) {
            context.report({
              node,
              messageId: 'noWhitespaceForLayout',
            });
            return;
          }
        }
      },
    };
  },
};
