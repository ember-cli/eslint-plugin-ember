/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of (mut) helper',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-mut-helper.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          setterAlternative: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noMutHelper: '{{message}}',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const setterAlternative = options.setterAlternative;
    const message = setterAlternative
      ? `Do not use the (mut) helper. Consider using a JS action or {{${setterAlternative}}} instead.`
      : 'Do not use the (mut) helper. Use regular setters or actions instead.';

    function checkNode(node) {
      if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'mut') {
        context.report({
          node,
          messageId: 'noMutHelper',
          data: { message },
        });
      }
    }

    return {
      GlimmerSubExpression: checkNode,
      GlimmerMustacheStatement: checkNode,
    };
  },
};
