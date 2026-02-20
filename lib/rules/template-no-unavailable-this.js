function isInsideClassOrFunction(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === 'ClassBody' ||
      current.type === 'FunctionExpression' ||
      current.type === 'FunctionDeclaration'
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `this` in templates that are not inside a class or function',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unavailable-this.md',
    },
    schema: [],
    messages: {
      noUnavailableThis:
        '`this` is not available in a template that is not inside a class or function.',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        if (
          (node.original === 'this' || node.original?.startsWith('this.')) &&
          !isInsideClassOrFunction(node)
        ) {
          context.report({
            node,
            messageId: 'noUnavailableThis',
          });
        }
      },
    };
  },
};
