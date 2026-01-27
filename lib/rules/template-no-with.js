/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{with}} helper',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-with.md',
    },
    schema: [],
    messages: {
      deprecated:
        'The use of the with helper has been deprecated. See https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-with.js',
      docs: 'docs/rule/no-with.md',
      tests: 'test/unit/rules/no-with-test.js',
    },
  },
  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'with') {
          context.report({ node, messageId: 'deprecated' });
        }
      },
    };
  },
};
