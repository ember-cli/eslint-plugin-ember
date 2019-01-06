'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Do not provide unnecessary `path` option which matches the route name.';

module.exports = {
  meta: {
    docs: {
      description: 'Disallow unnecessary route `path` option',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    ERROR_MESSAGE
  },

  create(context) {
    return {
      CallExpression(node) {
        if (!ember.isRoute(node)) {
          return;
        }

        const hasExplicitPathOption = utils.isObjectExpression(node.arguments[1]) && hasPropertyWithKeyName(node.arguments[1], 'path');
        if (!hasExplicitPathOption) {
          return;
        }

        const pathOptionNode = getPropertyByKeyName(node.arguments[1], 'path');
        const pathOptionValue = pathOptionNode.value.value;
        const routeName = node.arguments[0].value;

        if (pathMatchesRouteName(pathOptionValue, routeName)) {
          context.report({
            node: pathOptionNode,
            message: ERROR_MESSAGE
          });
        }
      }
    };
  }
};

function hasPropertyWithKeyName(objectExpression, keyName) {
  return getPropertyByKeyName(objectExpression, keyName) !== undefined;
}

function getPropertyByKeyName(objectExpression, keyName) {
  return objectExpression.properties.find(property => property.key.name === keyName);
}

function pathMatchesRouteName(path, routeName) {
  const pathWithoutOptionalLeadingSlash = path.substring(0, 1) === '/' ? path.substring(1) : path;
  return pathWithoutOptionalLeadingSlash === routeName;
}
