/** @type {import('eslint').Rule.RuleModule} */
const DEPRECATION_URL = 'https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{with}} helper',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-with.md',
      templateMode: 'loose',
    },
    schema: [],
    messages: {
      deprecated: `The use of \`{{withHelper}}\` has been deprecated. Please see the deprecation guide at ${DEPRECATION_URL}.`,
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
          context.report({ node, messageId: 'deprecated', data: { withHelper: '{{with}}' } });
        }
      },
    };
  },
};
