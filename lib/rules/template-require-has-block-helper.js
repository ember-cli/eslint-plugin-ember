/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require (has-block) helper usage instead of hasBlock property',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-has-block-helper.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [],
    messages: {
      useHasBlockHelper: 'Use (has-block) helper instead of hasBlock property.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-has-block-helper.js',
      docs: 'docs/rule/require-has-block-helper.md',
      tests: 'test/unit/rules/require-has-block-helper-test.js',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        if (
          node.original === 'hasBlock' ||
          node.original === 'this.hasBlock' ||
          node.original === 'hasBlockParams' ||
          node.original === 'this.hasBlockParams'
        ) {
          context.report({
            node,
            messageId: 'useHasBlockHelper',
          });
        }
      },
    };
  },
};
