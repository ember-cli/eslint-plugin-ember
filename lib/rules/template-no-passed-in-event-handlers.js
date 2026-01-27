/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow passing event handlers directly as component arguments',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-passed-in-event-handlers.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Avoid passing event handlers like @{{name}} directly. Use the (on) modifier on the element instead.',
    },
  },

  create(context) {
    const EVENT_HANDLER_PATTERN = /^on[A-Z][a-z]/; // onClick, onSubmit, onHover, etc. but not onChange

    return {
      GlimmerElementNode(node) {
        // Only check component invocations (PascalCase)
        if (!/^[A-Z]/.test(node.tag)) {
          return;
        }

        if (node.attributes) {
          for (const attr of node.attributes) {
            if (attr.name && attr.name.startsWith('@')) {
              const argName = attr.name.slice(1);
              if (EVENT_HANDLER_PATTERN.test(argName)) {
                context.report({
                  node: attr,
                  messageId: 'unexpected',
                  data: { name: argName },
                });
              }
            }
          }
        }
      },
    };
  },
};
