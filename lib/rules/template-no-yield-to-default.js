/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow yield to default block',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-yield-to-default.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noYieldToDefault:
        'Do not use (yield to="default"). Use (yield) without the "to" argument instead.',
      noExplicitDefaultBlock:
        'Do not pass "default" explicitly. The default block is used when no name is specified.',
    },
  },

  create(context) {
    const BLOCK_HELPERS = new Set(['has-block', 'has-block-params', 'hasBlock', 'hasBlockParams']);

    function checkDefaultBlockHelper(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        BLOCK_HELPERS.has(node.path.original) &&
        node.params &&
        node.params.length > 0 &&
        node.params[0].type === 'GlimmerStringLiteral' &&
        node.params[0].value === 'default'
      ) {
        context.report({
          node,
          messageId: 'noExplicitDefaultBlock',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'yield' &&
          node.hash &&
          node.hash.pairs
        ) {
          for (const pair of node.hash.pairs) {
            if (
              pair.key === 'to' &&
              pair.value.type === 'GlimmerStringLiteral' &&
              pair.value.value === 'default'
            ) {
              context.report({
                node,
                messageId: 'noYieldToDefault',
              });
            }
          }
        }
        checkDefaultBlockHelper(node);
      },
      GlimmerSubExpression(node) {
        checkDefaultBlockHelper(node);
      },
    };
  },
};
