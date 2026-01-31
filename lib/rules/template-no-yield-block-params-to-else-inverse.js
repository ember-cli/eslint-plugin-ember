const ERROR_MESSAGE = 'Yielding block params to else/inverse block is not allowed';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow yielding block params to else or inverse block',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-yield-block-params-to-else-inverse.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        // Only check yield statements
        if (node.path.original !== 'yield') {
          return;
        }

        // Must have params
        if (!node.params || node.params.length === 0) {
          return;
        }

        // Check if there's a 'to' hash with 'else' or 'inverse' value
        if (node.hash && node.hash.pairs) {
          const toPair = node.hash.pairs.find((pair) => pair.key === 'to');

          if (toPair && toPair.value && toPair.value.type === 'GlimmerStringLiteral') {
            const toValue = toPair.value.value;
            if (toValue === 'else' || toValue === 'inverse') {
              context.report({
                node,
                message: ERROR_MESSAGE,
              });
            }
          }
        }
      },
    };
  },
};
