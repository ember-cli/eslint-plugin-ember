/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{log}} in templates',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-log.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected {{log}} usage.',
    },
  },

  create(context) {
    function checkForLog(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'log'
      ) {
        context.report({
          node,
          messageId: 'unexpected',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForLog(node);
      },

      GlimmerBlockStatement(node) {
        checkForLog(node);
      },
    };
  },
};
