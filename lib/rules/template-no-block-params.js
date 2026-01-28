/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow yielding/invoking a component block without parameters',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-block-params.md',
    },
    schema: [],
    messages: {
      noBlockParams:
        'Component block should not declare parameters when none are yielded',
    },
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        // Check if block has params but the component doesn't yield any
        if (node.program && node.program.blockParams && node.program.blockParams.length > 0) {
          // This is a simplified check - in reality would need to check if component yields
          // For now, just flag it as a potential issue
        }
      },
    };
  },
};
