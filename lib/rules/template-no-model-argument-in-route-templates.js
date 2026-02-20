/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow @model argument in route templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-model-argument-in-route-templates.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noModelArgumentInRouteTemplates:
        'Unexpected @model in route template. Use this.model in the controller or component instead.',
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename();
    const isRouteTemplate =
      filename.includes('/templates/') &&
      !filename.includes('/components/') &&
      filename.endsWith('.hbs');
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerPathExpression(node) {
        // Check for @model usage
        if (node.original === '@model' || node.original.startsWith('@model.')) {
          // Only report in route templates (hbs files in templates/ directory)
          if (isRouteTemplate) {
            const replacement = node.original.replace('@model', 'this.model');
            context.report({
              node,
              messageId: 'noModelArgumentInRouteTemplates',
              fix(fixer) {
                return fixer.replaceText(node, replacement);
              },
            });
          }
        }
      },
    };
  },
};
