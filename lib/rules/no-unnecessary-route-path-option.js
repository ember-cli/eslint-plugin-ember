'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const fixerUtils = require('../utils/fixer');
const { getNodeOrNodeFromVariable } = require('../utils/utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Do not provide unnecessary `path` option which matches the route name.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary usage of the route `path` option',
      category: 'Routes',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unnecessary-route-path-option.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    return {
      CallExpression(node) {
        if (!ember.isRoute(node)) {
          return;
        }

        let optionsNode;
        const hasExplicitPathOption =
          node.arguments.length >= 2 &&
          (optionsNode = getNodeOrNodeFromVariable(node.arguments[1], scopeManager)) &&
          optionsNode.type === 'ObjectExpression' &&
          hasPropertyWithKeyName(optionsNode, 'path');
        if (!hasExplicitPathOption) {
          return;
        }

        const pathOptionNode = getPropertyByKeyName(optionsNode, 'path');
        const pathOptionValue = pathOptionNode.value.value;
        const routeName = node.arguments[0].value;

        if (pathMatchesRouteName(pathOptionValue, routeName)) {
          context.report({
            node: pathOptionNode,
            message: ERROR_MESSAGE,
            fix(fixer) {
              const sourceCode = context.getSourceCode();

              if (optionsNode.parent.type === 'VariableDeclarator') {
                // When the options object is a separate variable.
                return optionsNode.properties.length === 1
                  ? fixer.remove(pathOptionNode)
                  : fixerUtils.removeCommaSeparatedNode(pathOptionNode, sourceCode, fixer);
              }

              // If the `path` option is the only property in the object, remove the entire object.
              const shouldRemoveObject = optionsNode.properties.length === 1;
              const nodeToRemove = shouldRemoveObject ? optionsNode : pathOptionNode;

              return fixerUtils.removeCommaSeparatedNode(nodeToRemove, sourceCode, fixer);
            },
          });
        }
      },
    };
  },
};

function hasPropertyWithKeyName(objectExpression, keyName) {
  return getPropertyByKeyName(objectExpression, keyName) !== undefined;
}

function getPropertyByKeyName(objectExpression, keyName) {
  return objectExpression.properties.find(
    (property) =>
      types.isProperty(property) &&
      types.isIdentifier(property.key) &&
      property.key.name === keyName
  );
}

function pathMatchesRouteName(path, routeName) {
  if (!path || !routeName) {
    return false;
  }

  const pathWithoutOptionalLeadingSlash = path.slice(0, 1) === '/' ? path.slice(1) : path;
  return pathWithoutOptionalLeadingSlash === routeName;
}
