const ERROR_MESSAGE =
  'Templates are required to be in strict mode. Consider refactoring to template tag format.';

function isStrictModeFile(filePath) {
  return filePath?.endsWith('.gjs') || filePath?.endsWith('.gts');
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require templates to be in strict mode',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-strict-mode.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [],
    messages: {},
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-strict-mode.js',
      docs: 'docs/rule/require-strict-mode.md',
      tests: 'test/unit/rules/require-strict-mode-test.js',
    },
  },

  create(context) {
    const filePath = context.filename;

    return {
      'GlimmerTemplate:exit'(node) {
        if (!isStrictModeFile(filePath)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
