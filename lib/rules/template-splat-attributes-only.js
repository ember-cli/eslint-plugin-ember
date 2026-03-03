/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow ...spread other than ...attributes',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-splat-attributes-only.md',
    },
    schema: [],
    messages: {
      onlyAttributes: 'Only `...attributes` can be applied to elements',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/splat-attributes-only.js',
      docs: 'docs/rule/splat-attributes-only.md',
      tests: 'test/unit/rules/splat-attributes-only-test.js',
    },
  },
  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (node.name?.startsWith('...') && node.name !== '...attributes') {
          context.report({ node, messageId: 'onlyAttributes' });
        }
      },
    };
  },
};
