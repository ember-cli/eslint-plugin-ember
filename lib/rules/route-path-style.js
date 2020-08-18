'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Use kebab-case in route path.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce usage of kebab-case (instead of snake_case or camelCase) in route paths',
      category: 'Routes',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/route-path-style.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (!ember.isRoute(node) || node.arguments.length === 0) {
          return;
        }

        // Retrieve the path based on the call format used:
        // 1. this.route('route-and-path');
        // 2. this.route('route', { path: 'path' });

        const hasExplicitPathOption =
          node.arguments.length >= 2 &&
          types.isObjectExpression(node.arguments[1]) &&
          hasPropertyWithKeyName(node.arguments[1], 'path');
        const pathValueNode = hasExplicitPathOption
          ? getPropertyByKeyName(node.arguments[1], 'path').value
          : node.arguments[0];

        if (!types.isStringLiteral(pathValueNode)) {
          return;
        }

        const urlSegments = getStaticURLSegments(pathValueNode.value);

        if (urlSegments.some((urlPart) => !isKebabCase(urlPart))) {
          context.report(pathValueNode, ERROR_MESSAGE);
        }
      },
    };
  },
};

function hasPropertyWithKeyName(objectExpression, keyName) {
  return getPropertyByKeyName(objectExpression, keyName) !== undefined;
}

function getPropertyByKeyName(objectExpression, keyName) {
  return objectExpression.properties.find((property) => property.key.name === keyName);
}

function getStaticURLSegments(path) {
  return path
    .split('/')
    .filter(
      (segment) => !isDynamicSegment(segment) && !isWildcardSegment(segment) && segment !== ''
    );
}

function isDynamicSegment(segment) {
  return segment.includes(':');
}

function isWildcardSegment(segment) {
  return segment.includes('*');
}

const KEBAB_CASE_REGEXP = /^[\da-z-]+$/;
function isKebabCase(str) {
  return str.match(KEBAB_CASE_REGEXP);
}
