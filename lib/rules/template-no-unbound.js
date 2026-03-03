/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{unbound}} helper',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unbound.md',
    },
    schema: [],
    messages: { unexpected: 'Unexpected unbound helper usage.' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unbound.js',
      docs: 'docs/rule/no-unbound.md',
      tests: 'test/unit/rules/no-unbound-test.js',
    },
  },
  create(context) {
    function check(node) {
      if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'unbound') {
        context.report({ node, messageId: 'unexpected' });
      }
    }
    return {
      GlimmerMustacheStatement: check,
      GlimmerBlockStatement: check,
      GlimmerSubExpression: check,
    };
  },
};
