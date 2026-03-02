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
    fixable: 'code',
    schema: [],
    messages: { unnecessary: 'Unnecessary curly braces in string.' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unnecessary-curly-strings.js',
      docs: 'docs/rule/no-unnecessary-curly-strings.md',
      tests: 'test/unit/rules/no-unnecessary-curly-strings-test.js',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerAttrNode(node) {
        if (
          node.value?.type === 'GlimmerMustacheStatement' &&
          node.value.path?.type === 'GlimmerStringLiteral'
        ) {
          const strValue = node.value.path.value || node.value.path.original;
          context.report({
            node: node.value,
            messageId: 'unnecessary',
            fix(fixer) {
              return fixer.replaceText(node.value, `"${strValue}"`);
            },
          });
        }
      },
      GlimmerMustacheStatement(node) {
        if (node.path?.type === 'GlimmerStringLiteral' && node.parent?.type !== 'GlimmerAttrNode') {
          const strValue = node.path.value || node.path.original;
          context.report({
            node,
            messageId: 'unnecessary',
            fix(fixer) {
              return fixer.replaceText(node, strValue);
            },
          });
        }
      },
    };
  },
};
