/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow multiple consecutive empty lines in templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-multiple-empty-lines.md',
    },
    fixable: null,
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
  },

  create(context) {
    const max = context.options[0]?.max ?? 1;
    const sourceCode = context.sourceCode;

    return {
      Program(node) {
        const text = sourceCode.getText();
        const lines = text.split('\n');
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
              });
            }
            emptyCount = 0;
            firstEmptyLine = -1;
          }
        }
      },
    };
  },
};
