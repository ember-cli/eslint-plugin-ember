/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow @args in paths',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-args-paths.md',
    },
    schema: [],
    messages: { argsPath: 'Do not use paths with @args, use @argName directly instead.' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-args-paths.js',
      docs: 'docs/rule/no-args-paths.md',
      tests: 'test/unit/rules/no-args-paths-test.js',
    },
  },
  create(context) {
    return {
      GlimmerPathExpression(node) {
        const path = node.original;
        if (
          path?.startsWith('@args.') ||
          path?.startsWith('args.') ||
          path?.startsWith('this.args.')
        ) {
          context.report({ node, messageId: 'argsPath' });
        }
      },
    };
  },
};
