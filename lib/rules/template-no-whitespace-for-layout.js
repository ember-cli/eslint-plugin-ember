/** @type {import('eslint').Rule.RuleModule} */
const ERROR_MESSAGE = 'Excess whitespace detected.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using whitespace for layout purposes',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-whitespace-for-layout.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noWhitespaceForLayout: ERROR_MESSAGE,
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-whitespace-for-layout.js',
      docs: 'docs/rule/no-whitespace-for-layout.md',
      tests: 'test/unit/rules/no-whitespace-for-layout-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerTextNode(node) {
        // Upstream ember-template-lint only visits body text; its HBS parser
        // exposes attribute values as strings rather than TextNode children.
        // ember-eslint-parser emits them as GlimmerTextNode children of a
        // GlimmerAttrNode, so skip those to match upstream scope.
        if (node.parent?.type === 'GlimmerAttrNode') {
          return;
        }

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
