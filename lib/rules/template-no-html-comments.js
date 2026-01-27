/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow HTML comments in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-html-comments.md',
    },
    schema: [],
    messages: {
      noHtmlComments:
        'HTML comments should not be used in templates. Use Handlebars comments instead.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      'Program:exit'(node) {
        // Check for HTML comments in the source text
        const sourceCode = context.sourceCode || context.getSourceCode();
        const text = sourceCode.getText(node);

        // Find all HTML comments in template blocks
        const htmlCommentRegex = /<!--[\S\s]*?-->/g;
        let match;

        while ((match = htmlCommentRegex.exec(text)) !== null) {
          // Check if this comment is within a template
          const beforeComment = text.slice(0, match.index);
          const templateStart = beforeComment.lastIndexOf('<template>');
          const templateEnd = text.indexOf('</template>', match.index);

          if (templateStart !== -1 && templateEnd !== -1) {
            context.report({
              loc: {
                start: sourceCode.getLocFromIndex(match.index),
                end: sourceCode.getLocFromIndex(match.index + match[0].length),
              },
              messageId: 'noHtmlComments',
            });
          }
        }
      },
    };
  },
};
