/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary curly braces in string interpolations',
      category: 'Style',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-curly-strings.md',
    },
    schema: [],
    messages: { unnecessary: 'Unnecessary curly braces in string.' },
  },
  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (
          node.value?.type === 'GlimmerMustacheStatement' &&
          node.value.path?.type === 'GlimmerStringLiteral'
        ) {
          context.report({ node: node.value, messageId: 'unnecessary' });
        }
      },
    };
  },
};
