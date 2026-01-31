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
      noAttrs: 'Component templates should not contain `attrs`.',
    },
  },
  create(context) {
    return {
      GlimmerPathExpression(node) {
        // Check if the path starts with "attrs"
        if (node.original?.startsWith('attrs.') || node.original === 'attrs') {
          context.report({ node, messageId: 'noAttrs' });
        }
      },
    };
  },
};
