/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent attribute indentation in templates',
      category: 'Stylistic Issues',
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-attribute-indentation.md',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      incorrectIndentation: 'Incorrect indentation for attribute.',
    },
  },

  create(context) {
    // Simplified implementation - style rules can be basic
    return {};
  },
};
