/**
 * @fileoverview Disallow whitespace within mustache or block expression
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow whitespace within mustache or block expression',
      category: 'Style',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-whitespace-within-word.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      noWhitespace: 'Unexpected whitespace in {{"{{"}}{{name}}{{"}}"}}',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    
    return {
      'GlimmerMustacheStatement, GlimmerBlockStatement'(node) {
        const text = sourceCode.getText(node);
        
        // Check for {{ foo }} pattern (space after opening or before closing)
        if (/^\{\{\s/.test(text) || /\s\}\}$/.test(text)) {
          context.report({
            node,
            messageId: 'noWhitespace',
            data: { name: text },
          });
        }
      },
    };
  },
};
