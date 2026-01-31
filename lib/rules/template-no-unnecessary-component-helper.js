/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary component helper',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-component-helper.md',
    },
    schema: [],
    messages: {
      noUnnecessaryComponent:
        'Unnecessary use of (component) helper. Use angle bracket invocation instead.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'component' &&
          node.params &&
          node.params.length > 0 &&
          node.params[0].type === 'GlimmerStringLiteral'
        ) {
          context.report({
            node,
            messageId: 'noUnnecessaryComponent',
          });
        }
      },
    };
  },
};
