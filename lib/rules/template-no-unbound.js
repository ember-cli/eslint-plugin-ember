/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{unbound}} helper',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unbound.md',
    },
    schema: [],
    messages: { unexpected: 'Unexpected unbound helper usage.' },
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
