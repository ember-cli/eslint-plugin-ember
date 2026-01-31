/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require elements with aria-activedescendant to be tabbable (have tabindex)',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-aria-activedescendant-tabindex.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingTabindex:
        'Elements with aria-activedescendant must have tabindex attribute to be keyboard accessible.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const hasActiveDescendant = node.attributes?.some(
          (attr) => attr.name === 'aria-activedescendant'
        );

        if (!hasActiveDescendant) {
          return;
        }

        const hasTabindex = node.attributes?.some((attr) => attr.name === 'tabindex');

        if (!hasTabindex) {
          context.report({
            node,
            messageId: 'missingTabindex',
          });
        }
      },
    };
  },
};
