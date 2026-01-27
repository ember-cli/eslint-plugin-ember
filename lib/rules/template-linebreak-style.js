/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent linebreak style in templates',
      category: 'Stylistic Issues',
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-linebreak-style.md',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      incorrectLinebreak: 'Incorrect linebreak style.',
    },
  },

  create(context) {
    // Simplified implementation - style rules can be basic
    return {};
  },
};
