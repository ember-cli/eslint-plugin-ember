/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of built-in form components',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-builtin-form-components.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noInput:
        'Do not use the `Input` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.',
      noTextarea:
        'Do not use the `Textarea` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-builtin-form-components.js',
      docs: 'docs/rule/no-builtin-form-components.md',
      tests: 'test/unit/rules/no-builtin-form-components-test.js',
    },
  },

  create(context) {
    const MESSAGE_IDS = {
      Input: 'noInput',
      Textarea: 'noTextarea',
    };

    return {
      GlimmerElementNode(node) {
        const messageId = MESSAGE_IDS[node.tag];
        if (messageId) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
