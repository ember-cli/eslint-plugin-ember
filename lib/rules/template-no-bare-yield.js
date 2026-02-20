/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{yield}} without parameters outside of contextual components',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-bare-yield.md',
      strictGjs: true,
      strictGts: true,
    },
    schema: [],
    messages: {
      noBareYield: 'yield should have parameters or be used in contextual components only.',
      noYieldThis:
        '`this` can only be yielded from a template inside a class or function.',
    },
  },

  create(context) {
    function isInsideClassOrFunction(node) {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'ClassBody' ||
          current.type === 'FunctionExpression' ||
          current.type === 'FunctionDeclaration' ||
          current.type === 'ArrowFunctionExpression'
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'yield'
        ) {
          if (!node.params || node.params.length === 0) {
            context.report({
              node,
              messageId: 'noBareYield',
            });
          } else if (
            node.params.length === 1 &&
            node.params[0].type === 'GlimmerPathExpression' &&
            node.params[0].original === 'this' &&
            !isInsideClassOrFunction(node)
          ) {
            context.report({
              node,
              messageId: 'noYieldThis',
            });
          }
        }
      },
    };
  },
};
