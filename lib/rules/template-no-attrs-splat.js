/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow attribute splat on components',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-attrs-splat.md',
    },
    schema: [],
    messages: {
      noAttrsSplat: 'Avoid using ...attrs on components. Use ...attributes instead.',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === '...attrs'
        ) {
          context.report({
            node,
            messageId: 'noAttrsSplat',
          });
        }
      },
    };
  },
};
