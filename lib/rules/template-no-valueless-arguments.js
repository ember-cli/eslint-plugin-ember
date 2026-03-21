/** @type {import('eslint').Rule.RuleModule} */
function isNamedArgument(attrName) {
  return attrName.startsWith('@');
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow valueless named arguments',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-valueless-arguments.md',
      templateMode: 'both',
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
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerAttrNode(node) {
        if (!isNamedArgument(node.name)) {
          return;
        }

        if (!sourceCode.getText(node).includes('=')) {
          context.report({ node, messageId: 'valueless' });
        }
      },
    };
  },
};
