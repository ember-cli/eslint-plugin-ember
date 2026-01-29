/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow dynamic subexpression invocations',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-dynamic-subexpression-invocations.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noDynamicSubexpressionInvocations:
        'Do not use dynamic helper invocations. Use explicit helper names instead.',
    },
  },

  create(context) {
    return {
      GlimmerSubExpression(node) {
        // Check if the path is dynamic (contains @ or this)
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          (node.path.head?.type === 'AtHead' ||
            node.path.head?.type === 'ThisHead' ||
            node.path.parts?.length > 0)
        ) {
          // If it's not a simple identifier, it's dynamic
          if (node.path.head?.type === 'AtHead' || node.path.head?.type === 'ThisHead') {
            context.report({
              node,
              messageId: 'noDynamicSubexpressionInvocations',
            });
          }
        }
      },
      GlimmerMustacheStatement(node) {
        // Check for dynamic invocations in mustache statements
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.params &&
          node.params.length > 0
        ) {
          // If the helper name starts with @ or this, it's dynamic
          if (node.path.head?.type === 'AtHead' || node.path.head?.type === 'ThisHead') {
            context.report({
              node,
              messageId: 'noDynamicSubexpressionInvocations',
            });
          }
        }
      },
    };
  },
};
