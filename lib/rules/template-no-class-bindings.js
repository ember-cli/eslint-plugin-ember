/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of class attribute bindings',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-class-bindings.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noClassBindings:
        'Avoid using class attribute bindings. Use the (class) helper or individual classes instead.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!node.attributes) {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode' && attr.name === 'class') {
            if (attr.value && attr.value.type === 'GlimmerMustacheStatement') {
              const path = attr.value.path;
              if (
                path &&
                path.type === 'GlimmerPathExpression' &&
                path.original &&
                path.original.includes(':')
              ) {
                context.report({
                  node: attr,
                  messageId: 'noClassBindings',
                });
              }
            }
          }
        }
      },
    };
  },
};
