/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow trailing whitespace at the end of lines in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-trailing-spaces.md',
      templateMode: 'both',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      unexpected: 'Trailing whitespace detected.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-trailing-spaces.js',
      docs: 'docs/rule/no-trailing-spaces.md',
      tests: 'test/unit/rules/no-trailing-spaces-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const glimmerTemplateRanges = [];

    return {
      GlimmerTemplate(node) {
        glimmerTemplateRanges.push(node.range);
      },

      'Program:exit'() {
        const text = sourceCode.getText();
        const lines = text.split('\n');
        let lineOffset = 0;

        for (const [index, line] of lines.entries()) {
          if (line.endsWith(' ') || line.endsWith('\t')) {
            const trimmedLength = line.trimEnd().length;
            const trailingStart = lineOffset + trimmedLength;
            const lineEnd = lineOffset + line.length;

            const isInTemplate = glimmerTemplateRanges.some(
              ([start, end]) => trailingStart >= start && lineEnd <= end
            );

            if (isInTemplate) {
              context.report({
                loc: {
                  start: { line: index + 1, column: trimmedLength },
                  end: { line: index + 1, column: line.length },
                },
                messageId: 'unexpected',
                fix(fixer) {
                  return fixer.removeRange([trailingStart, lineEnd]);
                },
              });
            }
          }

          lineOffset += line.length + 1; // +1 for the \n
        }
      },
    };
  },
};
