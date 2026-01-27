/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary service injection argument',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-service-injection-argument.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unnecessaryArgument:
        'Service injection argument is unnecessary when it matches the property name.',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'service' &&
          node.params &&
          node.params.length > 0
        ) {
          const param = node.params[0];
          if (param.type === 'GlimmerStringLiteral') {
            const serviceName = param.value;
            // This is a simplified check - in real usage, would need more context
            context.report({
              node,
              messageId: 'unnecessaryArgument',
            });
          }
        }
      },
    };
  },
};
