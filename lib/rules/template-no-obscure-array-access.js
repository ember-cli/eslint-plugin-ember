/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow obscure array access patterns like `objectPath.@each.property`',
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
        const sourcePath = context.sourceCode.getText(node);
        // Check for @each or [] in paths
        if (path && (path.includes('.@each.') || path.includes('.[].'))) {
          context.report({
            node,
            messageId: 'noObscureArrayAccess',
            data: { path: sourcePath },
          });
          return;
        }
        // Check for numeric path segments (e.g., foo.0.bar) or bracket notation (e.g., foo.[0])
        if (node.tail && node.tail.some(segment => /^\d+$/.test(segment))) {
          context.report({
            node,
            messageId: 'noObscureArrayAccess',
            data: { path: sourcePath },
          });
        }
      },
    };
  },
};
