/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow tagName attribute on {{input}} helper',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-input-tagname.md',
    },
    schema: [],
    messages: { unexpected: 'Unexpected tagName usage on input helper.' },
  },
  create(context) {
    function check(node) {
      if (!node.path) return;
      const attrs = node.hash?.pairs || [];
      const hasTagName = attrs.some((a) => a.key === 'tagName');
      
      if (node.path.original === 'input' && hasTagName) {
        context.report({ node, messageId: 'unexpected' });
      } else if (
        node.path.original === 'component' &&
        node.params?.[0]?.original === 'input' &&
        hasTagName
      ) {
        context.report({ node, messageId: 'unexpected' });
      }
    }
    return {
      GlimmerMustacheStatement: check,
      GlimmerSubExpression: check,
    };
  },
};
