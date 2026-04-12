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
    const sourceCode = context.sourceCode;

    return {
      Program(node) {
        const text = sourceCode.getText();
        const lines = text.split('\n');

        // Precompute the character offset of the start of each line.
        const lineOffsets = [];
        let offset = 0;
        for (const line of lines) {
          lineOffsets.push(offset);
          offset += line.length + 1; // +1 for the '\n'
        }

        // Swallow the final newline, as some editors add it automatically
        // and we don't want it to cause an issue.
        const effectiveLines = lines.length > 0 && lines.at(-1) === '' ? lines.slice(0, -1) : lines;

        let emptyCount = 0;
        let firstEmptyLine = -1;

        function reportExcess(endIndex) {
          const startLine = firstEmptyLine + max;
          const endLine = endIndex;

          // Remove the excess empty lines: keep `max` empty lines,
          // remove everything from the start of the (max+1)-th empty
          // line to the start of the next non-empty line (or end of content).
          const rangeStart = lineOffsets[firstEmptyLine + max];
          const rangeEnd = endIndex < lines.length ? lineOffsets[endIndex] : text.length;

          context.report({
            loc: {
              start: { line: startLine + 1, column: 0 },
              end: { line: endLine + 1, column: 0 },
            },
            messageId: 'unexpected',
            data: {
              max,
              pluralizedLines: max === 1 ? 'line' : 'lines',
            },
            fix(fixer) {
              return fixer.replaceTextRange([rangeStart, rangeEnd], '');
            },
          });
        }

        for (const [index, line] of effectiveLines.entries()) {
          if (line.trim() === '') {
            if (emptyCount === 0) {
              firstEmptyLine = index;
            }
            emptyCount++;
          } else {
            if (emptyCount > max) {
              reportExcess(index);
            }
            emptyCount = 0;
            firstEmptyLine = -1;
          }
        }

        // Handle trailing empty lines at the end of the effective content
        if (emptyCount > max) {
          reportExcess(effectiveLines.length);
        }
      },
    };
  },
};
