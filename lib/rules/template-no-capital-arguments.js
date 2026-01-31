/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow capital arguments (use lowercase @arg instead of @Arg)',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-capital-arguments.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noCapitalArguments:
        'Argument names should start with lowercase. Use @{{lowercase}} instead of @{{name}}.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    function checkPath(node, path) {
      if (!path || !path.head) {
        return;
      }

      const name = path.head.name || path.head;
      if (typeof name === 'string' && name.startsWith('@') && /^@[A-Z]/.test(name)) {
        const lowercase = name.charAt(0) + name.charAt(1).toLowerCase() + name.slice(2);
        context.report({
          node,
          messageId: 'noCapitalArguments',
          data: {
            name,
            lowercase,
          },
        });
      }
    }

    return {
      GlimmerPathExpression(node) {
        checkPath(node, node);
      },
    };
  },
};
