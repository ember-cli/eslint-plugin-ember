/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of {{action}} modifiers',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action-modifiers.md',
    },
    fixable: null,
    schema: [
      {
        oneOf: [
          {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          {
            type: 'object',
            properties: {
              allowlist: {
                type: 'array',
                items: { type: 'string' },
                uniqueItems: true,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      noActionModifier: 'Do not use action modifiers. Use on modifier with a function instead.',
    },
  },

  create(context) {
    const firstOption = context.options[0];
    const allowlist = Array.isArray(firstOption) ? firstOption : (firstOption?.allowlist || []);

    function checkForActionModifier(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'action' &&
        node.path.head?.type !== 'AtHead' &&
        node.path.head?.type !== 'ThisHead'
      ) {
        context.report({
          node,
          messageId: 'noActionModifier',
        });
      }
    }

    return {
      GlimmerElementModifierStatement(node) {
        const parent = node.parent;
        if (parent && parent.type === 'GlimmerElementNode' && allowlist.includes(parent.tag)) {
          return;
        }
        checkForActionModifier(node);
      },
    };
  },
};
