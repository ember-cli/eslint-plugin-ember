/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow passing more than one argument to the mut helper',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-extra-mut-helper-argument.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [],
    messages: {},
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-extra-mut-helper-argument.js',
      docs: 'docs/rule/no-extra-mut-helper-argument.md',
      tests: 'test/unit/rules/no-extra-mut-helper-argument-test.js',
    },
  },

  create(context) {
    const ERROR_MESSAGE =
      'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.';

    return {
      GlimmerSubExpression(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'mut'
        ) {
          if (node.params && node.params.length > 1) {
            context.report({
              node,
              message: ERROR_MESSAGE,
            });
          }
        }
      },
    };
  },
};
