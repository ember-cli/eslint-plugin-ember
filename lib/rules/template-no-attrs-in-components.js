/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow attrs in component templates',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-attrs-in-components.md',
    },
    schema: [],
    messages: {
      noThisAttrs:
        'Component templates should not contain `this.attrs`. Use `@arg` syntax instead.',
    },
  },
  create(context) {
    return {
      GlimmerPathExpression(node) {
        if (
          node.original?.startsWith('this.attrs.') ||
          node.original === 'this.attrs' ||
          node.original?.startsWith('attrs.')
        ) {
          context.report({ node, messageId: 'noThisAttrs' });
        }
      },
    };
  },
};
