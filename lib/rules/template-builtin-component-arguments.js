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

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-builtin-component-arguments.md',
    },
    fixable: null,
    schema: [],
    messages: {},
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/builtin-component-arguments.js',
      docs: 'docs/rule/builtin-component-arguments.md',
      tests: 'test/unit/rules/builtin-component-arguments-test.js',
    },
  },

  create(context) {
    const filename = context.filename;
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // In GJS/GTS, track imports from @ember/component to distinguish
    // Ember's built-in Input/Textarea from custom components with the same name.
    // See https://github.com/ember-template-lint/ember-template-lint/issues/2786
    const importedComponents = new Map();

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/component') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const original = specifier.imported.name;
              if (original === 'Input' || original === 'Textarea') {
                importedComponents.set(specifier.local.name, original);
              }
            }
          }
        }
      },

      GlimmerElementNode(node) {
        const { tag, attributes } = node;

        // In strict mode (GJS/GTS), only flag if the component was imported from @ember/component
        if (isStrictMode) {
          const original = importedComponents.get(tag);
          if (!original) {
            return;
          }
          const forbiddenAttributes = FORBIDDEN_ATTRIBUTES[original];
          if (forbiddenAttributes && attributes) {
            for (const attribute of attributes) {
              if (attribute.name && forbiddenAttributes.has(attribute.name)) {
                context.report({
                  node: attribute,
                  message: generateErrorMessage(original, attribute.name),
                });
              }
            }
          }
          return;
        }

        // In loose mode (HBS), check by tag name directly
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
