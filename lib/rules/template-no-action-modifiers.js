/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of {{action}} modifiers',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action-modifiers.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [
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
    messages: {
      noActionModifier: 'Do not use action modifiers. Use on modifier with a function instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-action-modifiers.js',
      docs: 'docs/rule/no-action-modifiers.md',
      tests: 'test/unit/rules/no-action-modifiers-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowlist = new Set(options.allowlist || []);

    function checkForActionModifier(node) {
      // Check if this is an action modifier (not action helper in mustache)
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'action' &&
        node.path.head?.type !== 'AtHead' &&
        node.path.head?.type !== 'ThisHead'
      ) {
        // Check if the parent element is in the allowlist
        const parentElement = node.parent;
        if (parentElement && parentElement.tag && allowlist.has(parentElement.tag)) {
          return;
        }
        context.report({
          node,
          messageId: 'noActionModifier',
        });
      }
    }

    return {
      GlimmerElementModifierStatement(node) {
        checkForActionModifier(node);
      },
    };
  },
};
