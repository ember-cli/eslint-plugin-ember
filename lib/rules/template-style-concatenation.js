/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow string concatenation in inline styles',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-style-concatenation.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Avoid string concatenation in style attributes. Use a computed property with htmlSafe instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/style-concatenation.js',
      docs: 'docs/rule/style-concatenation.md',
      tests: 'test/unit/rules/style-concatenation-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const styleAttr = node.attributes?.find((a) => a.name === 'style');

        if (!styleAttr || !styleAttr.value) {
          return;
        }

        // Check if style attribute uses concatenation
        if (styleAttr.value.type === 'GlimmerConcatStatement') {
          context.report({
            node: styleAttr,
            messageId: 'unexpected',
          });
        }

        // Check for mustache containing concat helper
        if (styleAttr.value.type === 'GlimmerMustacheStatement') {
          const path = styleAttr.value.path;
          if (path && path.type === 'GlimmerPathExpression' && path.original === 'concat') {
            context.report({
              node: styleAttr,
              messageId: 'unexpected',
            });
          }
        }
      },
    };
  },
};
