'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const fixerUtils = require('../utils/fixer');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Do not provide unnecessary `path` option which matches the route name.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary usage of the route `path` option',
      category: 'Routes',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unnecessary-route-path-option.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (!ember.isRoute(node)) {
          return;
        }

        const hasExplicitPathOption =
          types.isObjectExpression(node.arguments[1]) &&
          hasPropertyWithKeyName(node.arguments[1], 'path');
        if (!hasExplicitPathOption) {
          return;
        }

        const pathOptionNode = getPropertyByKeyName(node.arguments[1], 'path');
        const pathOptionValue = pathOptionNode.value.value;
        const routeName = node.arguments[0].value;

        if (pathMatchesRouteName(pathOptionValue, routeName)) {
          context.report({
            node: pathOptionNode,
            message: ERROR_MESSAGE,
            fix(fixer) {
              const sourceCode = context.getSourceCode();

              // If the `path` option is the only property in the object, remove the entire object.
              const shouldRemoveObject = node.arguments[1].properties.length === 1;
              const nodeToRemove = shouldRemoveObject ? node.arguments[1] : pathOptionNode;

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
