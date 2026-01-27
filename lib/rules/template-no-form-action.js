/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of action attribute on form elements',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-form-action.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Do not use the action attribute on <form> elements. Use the (on) modifier with the "submit" event instead.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'form') {
          return;
        }

        const actionAttr = node.attributes?.find((a) => a.name === 'action');
        if (actionAttr) {
          context.report({
            node: actionAttr,
            messageId: 'unexpected',
          });
        }
      },
    };
  },
};
