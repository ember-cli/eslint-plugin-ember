/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow HTML comments in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-html-comments.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noHtmlComments:
        'HTML comments should not be used in templates. Use Handlebars comments instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-html-comments.js',
      docs: 'docs/rule/no-html-comments.md',
      tests: 'test/unit/rules/no-html-comments-test.js',
    },
  },

  create(context) {
    return {
      'Program:exit'(node) {
        // Check for HTML comments in the source text
        const sourceCode = context.sourceCode || context.getSourceCode();
        const text = sourceCode.getText(node);

        // Find all HTML comments in template blocks
        const htmlCommentRegex = /<!--([\S\s]*?)-->/g;
        let match;

        const hasTemplateTag = text.includes('<template>');

        while ((match = htmlCommentRegex.exec(text)) !== null) {
          let isInTemplate = false;

          if (hasTemplateTag) {
            const beforeComment = text.slice(0, match.index);
            const templateStart = beforeComment.lastIndexOf('<template>');
            const templateEnd = text.indexOf('</template>', match.index);
            isInTemplate = templateStart !== -1 && templateEnd !== -1;
          } else {
            // Standalone .hbs file — entire file is template content
            isInTemplate = true;
          }

          if (isInTemplate) {
            const commentContent = match[1];
            const startIndex = match.index;
            const endIndex = match.index + match[0].length;

            context.report({
              loc: {
                start: sourceCode.getLocFromIndex(startIndex),
                end: sourceCode.getLocFromIndex(endIndex),
              },
              messageId: 'noHtmlComments',
              fix(fixer) {
                return fixer.replaceTextRange([startIndex, endIndex], `{{!${commentContent}}}`);
              },
            });
          }
        }
      },
    };
  },
};
