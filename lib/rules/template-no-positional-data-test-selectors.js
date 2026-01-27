/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow positional data-test selectors',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-positional-data-test-selectors.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noPositionalDataTest:
        'Use named data-test attributes instead of positional data-test-* attributes.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-positional-data-test-selectors.js',
      docs: 'docs/rule/no-positional-data-test-selectors.md',
      tests: 'test/unit/rules/no-positional-data-test-selectors-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!node.attributes) {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode' && attr.name && attr.name.startsWith('data-test-')) {
            // Check if it's a positional selector (has a value that looks like an index)
            if (attr.value && attr.value.type === 'GlimmerTextNode') {
              const value = attr.value.chars;
              if (/^\d+$/.test(value)) {
                context.report({
                  node: attr,
                  messageId: 'noPositionalDataTest',
                });
              }
            }
          }
        }
      },

      GlimmerMustacheStatement(node) {
        if (!node.params) {
          return;
        }
        for (const param of node.params) {
          if (
            param.type === 'GlimmerPathExpression' &&
            param.original &&
            param.original.startsWith('data-test-')
          ) {
            context.report({
              node: param,
              messageId: 'noPositionalDataTest',
            });
          }
        }
      },
    };
  },
};
