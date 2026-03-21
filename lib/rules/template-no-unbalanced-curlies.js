const hbsParser = require('ember-eslint-parser/hbs');

const SUSPECT_CHARS = '}}';
const reLines = /(.*?(?:\r\n?|\n|$))/gm;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unbalanced mustache curlies',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unbalanced-curlies.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noUnbalancedCurlies: 'Unbalanced curlies detected',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unbalanced-curlies.js',
      docs: 'docs/rule/no-unbalanced-curlies.md',
      tests: 'test/unit/rules/no-unbalanced-curlies-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerTextNode(node) {
        const chars = node.chars;

        if (!chars.includes(SUSPECT_CHARS)) {
          return;
        }

        let isMustache = false;

        try {
          const ast = hbsParser.parseForESLint(chars).ast;
          const body = ast.body?.[0]?.body ?? ast.body ?? [];
          isMustache = body.length > 0 && body[0].type === 'GlimmerMustacheStatement';
        } catch {
          // Not a valid standalone mustache; continue checking for stray closing curlies.
        }

        if (isMustache) {
          return;
        }

        let lineNum = node.loc.start.line;
        let colNum = node.loc.start.column;
        const source = sourceCode.getText(node);
        const lines = chars.match(reLines) || [];

        for (const line of lines) {
          const suspectIndex = line.indexOf(SUSPECT_CHARS);

          if (suspectIndex !== -1) {
            const length = line.slice(suspectIndex).startsWith('}}}') ? 3 : 2;

            context.report({
              node,
              messageId: 'noUnbalancedCurlies',
              loc: {
                start: { line: lineNum, column: colNum + suspectIndex },
                end: { line: lineNum, column: colNum + suspectIndex + length },
              },
              source,
            });
          }

          lineNum++;
          colNum = 1;
        }
      },
    };
  },
};
