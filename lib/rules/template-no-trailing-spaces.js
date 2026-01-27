/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow trailing whitespace at the end of lines in templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-trailing-spaces.md',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      unexpected: 'Trailing whitespace detected.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      Program(node) {
        const text = sourceCode.getText();
        const lines = text.split('\n');

        for (const [index, line] of lines.entries()) {
          if (line.endsWith(' ') || line.endsWith('\t')) {
            const lineStart = lines.slice(0, index).join('\n').length + (index > 0 ? 1 : 0);
            const lineEnd = lineStart + line.length;

            context.report({
              loc: {
                start: { line: index + 1, column: line.trimEnd().length },
                end: { line: index + 1, column: line.length },
              },
              messageId: 'unexpected',
              fix(fixer) {
                return fixer.removeRange([lineStart + line.trimEnd().length, lineEnd]);
              },
            });
          }
        }
      },
    };
  },
};
