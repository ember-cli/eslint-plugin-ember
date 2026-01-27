/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary mut helpers',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-extra-mut-helpers.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unnecessaryMut: 'Unnecessary mut helper. Remove it.',
    },
  },

  create(context) {
    return {
      GlimmerSubExpression(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'mut' &&
          node.params &&
          node.params.length === 1
        ) {
          const param = node.params[0];
          // mut is unnecessary when wrapping a simple path expression
          if (param.type === 'GlimmerPathExpression') {
            context.report({
              node,
              messageId: 'unnecessaryMut',
            });
          }
        }
      },
    };
  },
};
