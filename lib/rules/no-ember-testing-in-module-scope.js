'use strict';

const messages = [
  'Ember.testing is not set in module scope',
  'Can not use destructuring to reference testing',
];

module.exports = {
  meta: {
    docs: {
      description: 'Prevents use of Ember.testing in module scope',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-ember-testing-in-module-scope.md'
    },
    fixable: null,
    messages,
  },

  create(context) {
    return {
      'MemberExpression[object.name="Ember"] > Identifier[name="testing"]': function (node) {
        if (context.getScope().variableScope.type === 'module') {
          context.report(node.parent, messages[0]);
        }
      },
      'VariableDeclarator[init.name = "Ember"] Property[key.name="testing"]': function (node) {
        context.report(node.parent.parent.parent.parent, messages[1]);
      },
    };
  },
};
