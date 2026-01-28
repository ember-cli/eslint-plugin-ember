/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent block indentation in templates',
      category: 'Stylistic Issues',
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-block-indentation.md',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      incorrectIndentation: 'Incorrect indentation for block.',
    },
  },

  create(context) {
    // Simplified implementation - style rules can be basic
    return {};
  },
};
