const ERROR_MESSAGE = 'A block named "default" is not valid';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow yield to default block',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-yield-to-default.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      invalidDefaultBlock: ERROR_MESSAGE,
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-yield-to-default.js',
      docs: 'docs/rule/no-yield-to-default.md',
      tests: 'test/unit/rules/no-yield-to-default-test.js',
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
          node: node.params[0],
          messageId: 'invalidDefaultBlock',
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
                node: pair,
                messageId: 'invalidDefaultBlock',
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
