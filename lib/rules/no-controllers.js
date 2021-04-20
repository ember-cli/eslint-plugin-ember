const ember = require('../utils/ember');
const types = require('../utils/types');
const utils = require('../utils/utils');
const assert = require('assert');

const ERROR_MESSAGE = 'Avoid using controllers except for specifying `queryParams`';

module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow non-essential controllers',
      category: 'Controllers',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-controllers.md',
    },
    fixable: null,
    schema: [],
  },

  create: (context) => {
    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    return {
      ClassDeclaration(node) {
        if (
          ember.isEmberController(context, node) &&
          (node.body.body.length === 0 || !classDeclarationHasProperty(node, 'queryParams'))
        ) {
          context.report(node, ERROR_MESSAGE);
        }
      },

      CallExpression(node) {
        if (
          ember.isEmberController(context, node) &&
          (node.arguments.length === 0 ||
            !callExpressionClassHasProperty(node, 'queryParams', scopeManager))
        ) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};

function classDeclarationHasProperty(classDeclaration, propertyName) {
  assert(types.isClassDeclaration(classDeclaration));
  return (
    classDeclaration.body.body.length > 0 &&
    classDeclaration.body.body.some(
      (item) =>
        types.isClassProperty(item) &&
        types.isIdentifier(item.key) &&
        item.key.name === propertyName
    )
  );
}

function callExpressionClassHasProperty(callExpression, propertyName, scopeManager) {
  assert(types.isCallExpression(callExpression));
  return (
    callExpression.arguments.length > 0 &&
    callExpression.arguments.some((arg) => {
      const resultingNode = utils.getNodeOrNodeFromVariable(arg, scopeManager);
      return (
        resultingNode &&
        resultingNode.type === 'ObjectExpression' &&
        resultingNode.properties.some(
          (prop) => types.isIdentifier(prop.key) && prop.key.name === propertyName
        )
      );
    })
  );
}
