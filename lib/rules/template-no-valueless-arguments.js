/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow valueless named arguments',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-valueless-arguments.md',
    },
    schema: [],
    messages: { valueless: 'Named arguments should have an explicitly assigned value.' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-valueless-arguments.js',
      docs: 'docs/rule/no-valueless-arguments.md',
      tests: 'test/unit/rules/no-valueless-arguments-test.js',
    },
  },
  create(context) {
    return {
      GlimmerAttrNode(node) {
        // Check if it's a named argument (@foo) with no value
        if (node.name?.startsWith('@')) {
          const sourceCode = context.sourceCode || context.getSourceCode();
          const text = sourceCode.getText(node);
          // Truly valueless if no '=' in the source text
          if (!text.includes('=')) {
            context.report({ node, messageId: 'valueless' });
          }
        }
      },
    };
  },
};
