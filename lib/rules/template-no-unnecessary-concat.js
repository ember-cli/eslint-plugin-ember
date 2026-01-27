/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary string concatenation',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-concat.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unnecessary: 'Unnecessary string concatenation. Use {{inner}} instead of {{outer}}.',
    },
  },
  create(context) {
    return {
      GlimmerConcatStatement(node) {
        if (node.parts?.length === 1) {
          const sourceCode = context.sourceCode;
          context.report({
            node,
            messageId: 'unnecessary',
            data: {
              inner: sourceCode.getText(node.parts[0]),
              outer: sourceCode.getText(node),
            },
            fix(fixer) {
              return fixer.replaceText(node, sourceCode.getText(node.parts[0]));
            },
          });
        }
      },
    };
  },
};
