/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow block usage of {{input}} helper',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-input-block.md',
      templateMode: 'loose',
    },
    schema: [],
    messages: { blockUsage: 'Unexpected block usage. The input helper may only be used inline.' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-input-block.js',
      docs: 'docs/rule/no-input-block.md',
      tests: 'test/unit/rules/no-input-block-test.js',
    },
  },
  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'input') {
          context.report({ node, messageId: 'blockUsage' });
        }
      },
    };
  },
};
