/**
 * @fileoverview Disallow whitespace within mustache or block expression
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'disallow whitespace within mustache or block expressions',
      category: 'Style',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-whitespace-within-word.md',
    },
    schema: [],
    messages: {
      noWhitespace: 'Unexpected whitespace in mustache expression',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      'GlimmerMustacheStatement, GlimmerBlockStatement'(node) {
        const text = sourceCode.getText(node);

        // Check for {{ foo }} pattern (space after opening or before closing)
        if (/^{{\s/.test(text) || /\s}}$/.test(text)) {
          context.report({
            node,
            messageId: 'noWhitespace',
          });
        }
      },
    };
  },
};
