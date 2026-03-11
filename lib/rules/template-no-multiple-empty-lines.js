/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow multiple consecutive empty lines in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-multiple-empty-lines.md',
      templateMode: 'both',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpected: 'More than {{max}} blank {{pluralizedLines}} not allowed.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-multiple-empty-lines.js',
      docs: 'docs/rule/no-multiple-empty-lines.md',
      tests: 'test/unit/rules/no-multiple-empty-lines-test.js',
    },
  },

  create(context) {
    const max = context.options[0]?.max ?? 1;
    const sourceCode = context.sourceCode || context.getSourceCode();
    const glimmerTemplateRanges = [];

    return {
      GlimmerTemplate(node) {
        glimmerTemplateRanges.push(node.range);
      },

      'Program:exit'() {
        const text = sourceCode.getText();
        const lines = text.split('\n');

        // Pre-calculate the start offset of each line
        const lineOffsets = [0];
        for (const line of lines) {
          lineOffsets.push(lineOffsets.at(-1) + line.length + 1);
        }

        let emptyCount = 0;
        let firstEmptyLine = -1;

        for (const [index, line] of lines.entries()) {
          if (line.trim() === '') {
            if (emptyCount === 0) {
              firstEmptyLine = index;
            }
            emptyCount++;
          } else {
            if (emptyCount > max) {
              const startLine = firstEmptyLine + max + 1;
              const endLine = index;

              // The fix removes lines [firstEmptyLine + max .. index - 1]
              const fixStart = lineOffsets[firstEmptyLine + max];
              const fixEnd = lineOffsets[index];

              const isInTemplate = glimmerTemplateRanges.some(
                ([start, end]) => fixStart >= start && fixEnd <= end
              );

              if (isInTemplate) {
                context.report({
                  loc: {
                    start: { line: startLine + 1, column: 0 },
                    end: { line: endLine, column: 0 },
                  },
                  messageId: 'unexpected',
                  data: {
                    max,
                    pluralizedLines: max === 1 ? 'line' : 'lines',
                  },
                  fix(fixer) {
                    return fixer.removeRange([fixStart, fixEnd]);
                  },
                });
              }
            }
            emptyCount = 0;
            firstEmptyLine = -1;
          }
        }
      },
    };
  },
};
