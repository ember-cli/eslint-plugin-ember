function toDisplay(value) {
  return value.replaceAll('\r', 'CR').replaceAll('\n', 'LF');
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent linebreaks in templates',
      category: 'Stylistic Issues',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-linebreak-style.md',
      templateMode: 'both',
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['unix', 'windows', 'system'],
      },
    ],
    messages: {
      wrongLinebreak: 'Wrong linebreak used. Expected {{expected}} but found {{found}}.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/linebreak-style.js',
      docs: 'docs/rule/linebreak-style.md',
      tests: 'test/unit/rules/linebreak-style-test.js',
    },
  },

  create(context) {
    const os = require('node:os');
    const option = context.options[0] || 'unix';
    let expectedLinebreak;
    if (option === 'system') {
      expectedLinebreak = os.EOL;
    } else if (option === 'windows') {
      expectedLinebreak = '\r\n';
    } else {
      expectedLinebreak = '\n';
    }

    const sourceCode = context.getSourceCode();

    return {
      'GlimmerTemplate:exit'(node) {
        const text = sourceCode.getText(node);
        const re = /\r\n?|\n/g;
        let match;

        while ((match = re.exec(text)) !== null) {
          const found = match[0];
          if (found !== expectedLinebreak) {
            const startIndex = node.range[0] + match.index;
            context.report({
              loc: {
                start: sourceCode.getLocFromIndex(startIndex),
                end: sourceCode.getLocFromIndex(startIndex + found.length),
              },
              messageId: 'wrongLinebreak',
              data: {
                expected: toDisplay(expectedLinebreak),
                found: toDisplay(found),
              },
              fix(fixer) {
                return fixer.replaceTextRange(
                  [startIndex, startIndex + found.length],
                  expectedLinebreak
                );
              },
            });
          }
        }
      },
    };
  },
};
