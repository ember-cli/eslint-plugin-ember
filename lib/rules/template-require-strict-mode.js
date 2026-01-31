const ERROR_MESSAGE =
  'Templates are required to be in strict mode. Consider refactoring to template tag format.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require templates to be in strict mode',
      category: 'Best Practices',
      recommended: false,
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-strict-mode.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      'GlimmerTemplate:exit'(node) {
        // Check if the template is in strict mode
        // Strict mode templates are in .gjs/.gts files
        // Non-strict templates are in .hbs files

        const filePath = context.getFilename ? context.getFilename() : context.filename;

        // Only flag .hbs files as non-strict
        if (filePath && filePath.endsWith('.hbs')) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
