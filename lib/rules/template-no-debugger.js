/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{debugger}} in templates',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-debugger.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected {{debugger}} usage.',
    },
  },

  create(context) {
    function checkForDebugger(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'debugger'
      ) {
        context.report({
          node,
          messageId: 'unexpected',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForDebugger(node);
      },

      GlimmerBlockStatement(node) {
        checkForDebugger(node);
      },
    };
  },
};
