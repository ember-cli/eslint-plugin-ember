const FORBIDDEN_ATTRIBUTES = {
  Input: new Set(['checked', 'type', 'value']),
  Textarea: new Set(['value']),
};

function generateErrorMessage(component, attribute) {
  return `Setting the \`${attribute}\` attribute on the builtin <${component}> component is not allowed. Did you mean \`@${attribute}\`?`;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow setting certain attributes on builtin components',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-builtin-component-arguments.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const { tag, attributes } = node;
        const forbiddenAttributes = FORBIDDEN_ATTRIBUTES[tag];

        if (forbiddenAttributes && attributes) {
          for (const attribute of attributes) {
            if (attribute.name && forbiddenAttributes.has(attribute.name)) {
              context.report({
                node: attribute,
                message: generateErrorMessage(tag, attribute.name),
              });
            }
          }
        }
      },
    };
  },
};
