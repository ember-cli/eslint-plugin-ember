/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require simple modifier syntax',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-simple-modifiers.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      // This catches {{(modifier ...)}} expressions
      GlimmerSubExpression(node) {
        // Check if this is a call to the 'modifier' helper
        if (node.path && node.path.original === 'modifier') {
          // The first param should be a string or a path expression
          if (!node.params || node.params.length === 0) {
            context.report({
              node,
              message:
                'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
            });
            return;
          }

          const firstParam = node.params[0];

          // Check if first param is a string literal or path expression
          const isValidFirstParam =
            firstParam.type === 'GlimmerStringLiteral' ||
            (firstParam.type === 'GlimmerPathExpression' && firstParam.original);

          if (!isValidFirstParam) {
            context.report({
              node: firstParam,
              message:
                'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
            });
          }
        }
      },
    };
  },
};
