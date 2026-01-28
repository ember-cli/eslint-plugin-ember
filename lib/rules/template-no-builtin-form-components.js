/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of built-in form components',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-builtin-form-components.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noBuiltinFormComponent:
        'Do not use built-in form components. Use native HTML elements instead.',
    },
  },

  create(context) {
    const BUILTIN_FORM_COMPONENTS = new Set(['Input', 'Textarea', 'LinkTo']);

    return {
      GlimmerElementNode(node) {
        if (BUILTIN_FORM_COMPONENTS.has(node.tag)) {
          context.report({
            node,
            messageId: 'noBuiltinFormComponent',
          });
        }
      },
    };
  },
};
