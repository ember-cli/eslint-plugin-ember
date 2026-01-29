/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require newline at end of template files',
      category: 'Stylistic Issues',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-eol-last.md',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
    ],
    messages: {
      missing: 'Newline required at end of file.',
      unexpected: 'Newline not allowed at end of file.',
    },
  },

  create(context) {
    const mode = context.options[0] || 'always';

    return {
      'Program:exit'(node) {
        const sourceCode = context.sourceCode || context.getSourceCode();

        // Only check files that have templates
        const hasTemplate = node.body.some(
          (n) =>
            n.type === 'GlimmerTemplate' ||
            (n.type === 'ExpressionStatement' && n.expression?.type === 'GlimmerTemplate')
        );

        if (!hasTemplate) {
          return;
        }

        const text = sourceCode.getText();
        const lastChar = text.at(-1);
        const endsWithNewline = lastChar === '\n' || lastChar === '\r';

        if (mode === 'always' && !endsWithNewline) {
          context.report({
            loc: {
              line: sourceCode.lines.length,
              column: sourceCode.lines.at(-1).length,
            },
            messageId: 'missing',
            fix(fixer) {
              return fixer.insertTextAfterRange([text.length, text.length], '\n');
            },
          });
        } else if (mode === 'never' && endsWithNewline) {
          // Find how many trailing newline characters there are
          // Handle both \n and \r\n properly
          let trailingNewlines = 0;
          let i = text.length - 1;

          while (i >= 0) {
            if (text[i] === '\n') {
              trailingNewlines++;
              // Check if previous char is \r (CRLF)
              if (i > 0 && text[i - 1] === '\r') {
                trailingNewlines++;
                i--;
              }
              i--;
            } else if (text[i] === '\r') {
              // Standalone \r
              trailingNewlines++;
              i--;
            } else {
              break;
            }
          }

          context.report({
            loc: {
              line: sourceCode.lines.length,
              column: 0,
            },
            messageId: 'unexpected',
            fix(fixer) {
              return fixer.removeRange([text.length - trailingNewlines, text.length]);
            },
          });
        }
      },
    };
  },
};
