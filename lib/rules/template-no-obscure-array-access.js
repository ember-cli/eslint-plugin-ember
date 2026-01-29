/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow obscure array access patterns like objectPath.@each.property',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-obscure-array-access.md',
    },
    schema: [],
    messages: {
      noObscureArrayAccess:
        'Unexpected obscure array access pattern "{{path}}". Use computed properties or helpers instead.',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        const path = node.original;
        // Check for @each or [] in paths
        // Note: These patterns typically cause parse errors in standard Glimmer templates
        // This rule serves as documentation and would catch them if they somehow made it through
        if (path && (path.includes('.@each.') || path.includes('.[].'))) {
          context.report({
            node,
            messageId: 'noObscureArrayAccess',
            data: { path },
          });
        }
      },
    };
  },
};
