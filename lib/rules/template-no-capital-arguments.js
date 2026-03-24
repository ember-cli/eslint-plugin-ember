const RESERVED = new Set(['@arguments', '@args', '@block', '@else']);
const ALLOWED_PREFIX = /^[a-z]/;

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
      reservedArgument: '{{name}} is a reserved argument name, try to use another.',
    },
  },

  create(context) {
    function checkArgName(node, name) {
      if (!name || !name.startsWith('@')) {
        return;
      }

      const part = name.slice(1);
      const firstChar = part.charAt(0);

      if (RESERVED.has(name)) {
        context.report({
          node,
          messageId: 'reservedArgument',
          data: { name },
        });
      } else if (!ALLOWED_PREFIX.test(firstChar)) {
        const lowercase = `@${firstChar.toLowerCase()}${part.slice(1)}`;
        context.report({
          node,
          messageId: 'noCapitalArguments',
          data: { name, lowercase },
        });
      }
    }

    return {
      GlimmerPathExpression(node) {
        const name = node.original || (node.head && (node.head.name || node.head));
        if (typeof name === 'string' && name.startsWith('@')) {
          checkArgName(node, name);
        }
      },
      GlimmerAttrNode(node) {
        if (node.name && node.name.startsWith('@')) {
          checkArgName(node, node.name);
        }
      },
    };
  },
};
