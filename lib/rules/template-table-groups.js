const TABLE_GROUPS = new Set(['thead', 'tbody', 'tfoot']);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require table elements to use table grouping elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-table-groups.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missing:
        'Tables should use <thead>, <tbody>, and/or <tfoot> to group related content for better accessibility.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'table') {
          return;
        }

        // Check if table has at least one grouping element
        const hasGrouping = node.children?.some(
          (child) => child.type === 'GlimmerElementNode' && TABLE_GROUPS.has(child.tag)
        );

        // Check if table has tr elements directly as children (without grouping)
        const hasDirectTr = node.children?.some(
          (child) => child.type === 'GlimmerElementNode' && child.tag === 'tr'
        );

        if (hasDirectTr && !hasGrouping) {
          context.report({
            node,
            messageId: 'missing',
          });
        }
      },
    };
  },
};
