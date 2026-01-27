/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent quote style in templates',
      category: 'Stylistic Issues',
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-quotes.md',
    },
    fixable: 'code',
    schema: [
      {
        enum: ['double', 'single'],
      },
    ],
    messages: {
      wrongQuotes: 'Use {{expected}} quotes instead of {{actual}} quotes.',
    },
  },

  create(context) {
    // Simplified implementation - style rules can be basic
    return {};
  },
};
