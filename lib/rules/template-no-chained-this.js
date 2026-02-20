/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow redundant `this.this` in templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-chained-this.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noChainedThis:
        'this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerPathExpression(node) {
        if (node.original?.startsWith('this.this.')) {
          context.report({
            node,
            messageId: 'noChainedThis',
            fix(fixer) {
              const text = sourceCode.getText(node);
              return fixer.replaceText(node, text.replace('this.this.', 'this.'));
            },
          });
        }
      },
      GlimmerElementNode(node) {
        if (node.tag?.startsWith('this.this.')) {
          context.report({
            node,
            messageId: 'noChainedThis',
          });
        }
      },
    };
  },
};
