/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow passing classBinding or classNameBindings as arguments in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-class-bindings.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [],
    messages: {
      noClassBindings:
        'Passing the `{{name}}` property as an argument within templates is not allowed.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-class-bindings.js',
      docs: 'docs/rule/no-class-bindings.md',
      tests: 'test/unit/rules/no-class-bindings-test.js',
    },
  },

  create(context) {
    const FORBIDDEN_ATTR_NAMES = new Set([
      'classBinding',
      '@classBinding',
      'classNameBindings',
      '@classNameBindings',
    ]);

    const FORBIDDEN_HASH_KEYS = new Set(['classBinding', 'classNameBindings']);

    return {
      'GlimmerElementNode > GlimmerAttrNode'(node) {
        if (FORBIDDEN_ATTR_NAMES.has(node.name)) {
          context.report({
            node,
            messageId: 'noClassBindings',
            data: { name: node.name },
          });
        }
      },
      GlimmerHashPair(node) {
        if (FORBIDDEN_HASH_KEYS.has(node.key)) {
          context.report({
            node,
            messageId: 'noClassBindings',
            data: { name: node.key },
          });
        }
      },
    };
  },
};
