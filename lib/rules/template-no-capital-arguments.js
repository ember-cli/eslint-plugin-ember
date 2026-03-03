function isInvalidArgName(name) {
  return typeof name === 'string' && name.startsWith('@') && /^@[A-Z_]/.test(name);
}

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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-capital-arguments.js',
      docs: 'docs/rule/no-capital-arguments.md',
      tests: 'test/unit/rules/no-capital-arguments-test.js',
    },
  },

  create(context) {
    function report(node, name) {
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

    return {
      GlimmerPathExpression(node) {
        const name = node.head?.name || node.head;
        if (isInvalidArgName(name)) {
          report(node, name);
        }
      },
      GlimmerAttrNode(node) {
        if (isInvalidArgName(node.name)) {
          report(node, node.name);
        }
      },
    };
  },
};
