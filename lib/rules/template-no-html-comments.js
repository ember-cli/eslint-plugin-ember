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
    const glimmerTemplateRanges = [];

    return {
      GlimmerTemplate(node) {
        glimmerTemplateRanges.push(node.range);
      },

      'Program:exit'() {
        const sourceCode = context.sourceCode || context.getSourceCode();
        const fullText = sourceCode.getText();

        for (const comment of sourceCode.getAllComments()) {
          if (comment.type !== 'Block') {continue;}

          // getAllComments() returns both HTML (<!-- -->) and Handlebars ({{! }}, {{!-- --}})
          // comments as Block type — only flag actual HTML comments.
          if (!fullText.startsWith('<!--', comment.range[0])) {continue;}

          const isInTemplate = glimmerTemplateRanges.some(
            ([start, end]) => comment.range[0] >= start && comment.range[1] <= end
          );

          if (isInTemplate) {
            context.report({
              loc: comment.loc,
              messageId: 'noHtmlComments',
              fix(fixer) {
                return fixer.replaceTextRange(comment.range, `{{!${comment.value}}}`);
              },
            });
          }
        }
      },
    };
  },
};
