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

    const filename = context.filename ?? context.getFilename();
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // local name → original name ('Input' | 'Textarea')
    // Only populated in GJS/GTS files via ImportDeclaration
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
        const tag = node.tag;
        if (isStrictMode) {
          // In GJS/GTS: only flag if explicitly imported from @ember/component
          const original = importedComponents.get(tag);
          if (original) {
            context.report({ node, messageId: MESSAGE_IDS[original] });
          }
        } else {
          // In HBS: flag by canonical name (no import context available)
          const messageId = MESSAGE_IDS[tag];
          if (messageId) {
            context.report({ node, messageId });
          }
        }
      },

      // Catch usages as a value: {{yield Input}}, (component Input), @field={{Input}}, etc.
      GlimmerPathExpression(node) {
        const name = node.original;
        if (isStrictMode) {
          const original = importedComponents.get(name);
          if (original) {
            context.report({ node, messageId: MESSAGE_IDS[original] });
          }
        } else {
          const messageId = MESSAGE_IDS[name];
          if (messageId) {
            context.report({ node, messageId });
          }
        }
      },
    };
  },
};
