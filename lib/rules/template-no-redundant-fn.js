/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary usage of (fn) helper',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-redundant-fn.md',
    },
    fixable: null,
    schema: [],
    messages: {
      redundant:
        'Unnecessary use of (fn) helper. Pass the function directly instead: {{suggestion}}',
    },
  },

  create(context) {
    function checkFnUsage(node) {
      // Check if this is an (fn) call with only one argument (the function itself)
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'fn' &&
        node.params &&
        node.params.length === 1 &&
        !node.hash?.pairs?.length
      ) {
        const param = node.params[0];
        const paramText =
          param.type === 'GlimmerPathExpression'
            ? param.original
            : context.sourceCode.getText(param);

        context.report({
          node,
          messageId: 'redundant',
          data: {
            suggestion: paramText,
          },
        });
      }
    }

    return {
      GlimmerSubExpression(node) {
        checkFnUsage(node);
      },

      GlimmerMustacheStatement(node) {
        checkFnUsage(node);
      },
    };
  },
};
