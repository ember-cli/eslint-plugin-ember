'use strict';

const ember = require('../utils/ember');

const messages = [
  'Ember.testing is not set in module scope',
  'Ember.testing should not be assigned to a variable, use in place instead',
  'Can not use destructuring to reference Ember.testing',
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
    let emberImportAliasName = 'Ember';
    let hasFoundImport = false;

    return {
      ImportDeclaration(node) {
        if (!hasFoundImport) {
          const aliasName = ember.getEmberImportAliasName(node);
          if (aliasName) {
            emberImportAliasName = aliasName;
            hasFoundImport = true;
          }
        }
      },

      'Identifier[name="testing"]': function (node) {
        if (node.parent.type === 'MemberExpression' && node.parent.object.name === emberImportAliasName) {
          if (context.getScope().variableScope.type === 'module') {
            context.report(node.parent, messages[0]);
          }
          if (node.parent.parent.type === 'AssignmentExpression' ||
            node.parent.parent.type === 'VariableDeclarator') {
            context.report(node.parent.parent, messages[1]);
          }
        }
      },

      'VariableDeclarator[init.name = "Ember"] Property[key.name="testing"]': function (node) {
        context.report(node.parent.parent.parent.parent, messages[2]);
      },
    };
  },
};
