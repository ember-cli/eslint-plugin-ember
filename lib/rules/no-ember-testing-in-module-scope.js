'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

const ERROR_MESSAGES = [
  'Ember.testing is not set in module scope',
  'Ember.testing should not be assigned to a variable, use in place instead',
  'Can not use destructuring to reference Ember.testing',
];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow use of `Ember.testing` in module scope',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-ember-testing-in-module-scope.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGES,

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

      'Identifier[name="testing"]'(node) {
        if (
          node.parent.type === 'MemberExpression' &&
          node.parent.object.name === emberImportAliasName
        ) {
          const sourceCode = context.sourceCode ?? context.getSourceCode();
          const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

          if (scope.variableScope.type === 'module') {
            context.report({ node: node.parent, message: ERROR_MESSAGES[0] });
          }
          const nodeGrandParent = utils.getPropertyValue(node, 'parent.parent.type');
          if (
            nodeGrandParent === 'AssignmentExpression' ||
            nodeGrandParent === 'VariableDeclarator'
          ) {
            context.report({ node: node.parent.parent, message: ERROR_MESSAGES[1] });
          }
        }
      },

      'Property[key.name="testing"]'(node) {
        if (
          utils.getAncestor(
            node,
            (ancestorNode) =>
              ancestorNode.type === 'VariableDeclarator' &&
              ancestorNode.init.name === emberImportAliasName
          )
        ) {
          context.report({ node: node.parent.parent.parent, message: ERROR_MESSAGES[2] });
        }
      },
    };
  },
};
