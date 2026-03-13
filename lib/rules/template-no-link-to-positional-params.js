/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow positional params in LinkTo component',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-link-to-positional-params.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noLinkToPositionalParams: 'Positional params in LinkTo are deprecated. Use @route instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-link-to-positional-params.js',
      docs: 'docs/rule/no-link-to-positional-params.md',
      tests: 'test/unit/rules/no-link-to-positional-params-test.js',
    },
  },

  create(context) {
    function checkForPositionalParams(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'link-to' &&
        node.params &&
        node.params.length > 0
      ) {
        context.report({
          node,
          messageId: 'noLinkToPositionalParams',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForPositionalParams(node);
      },

      GlimmerBlockStatement(node) {
        checkForPositionalParams(node);
      },
    };
  },
};
