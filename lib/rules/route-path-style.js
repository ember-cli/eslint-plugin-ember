'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const kebabCase = require('lodash.kebabcase');
const { getNodeOrNodeFromVariable } = require('../utils/utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Use kebab-case in route path.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce usage of kebab-case (instead of snake_case or camelCase) in route paths',
      category: 'Routes',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/route-path-style.md',
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      convertToKebabCase: 'Convert route path to kebab case',
    },
  },

  ERROR_MESSAGE,

  create(context) {
    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    return {
      CallExpression(node) {
        if (!ember.isRoute(node) || node.arguments.length === 0) {
          return;
        }

        // Retrieve the path based on the call format used:
        // 1. this.route('route-and-path');
        // 2. this.route('route', { path: 'path' });

        let optionsNode;
        const hasExplicitPathOption =
          node.arguments.length >= 2 &&
          (optionsNode = getNodeOrNodeFromVariable(node.arguments[1], scopeManager)) &&
          optionsNode.type === 'ObjectExpression' &&
          hasPropertyWithKeyName(optionsNode, 'path');
        const pathValueNode = hasExplicitPathOption
          ? getPropertyByKeyName(optionsNode, 'path').value
          : node.arguments[0];

        if (!types.isStringLiteral(pathValueNode)) {
          return;
        }

        const urlSegments = getStaticURLSegments(pathValueNode.value);

        if (urlSegments.some((urlPart) => !isKebabCase(urlPart))) {
          context.report({
            node: pathValueNode,
            message: ERROR_MESSAGE,
            suggest: [
              {
                messageId: 'convertToKebabCase',
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [pathValueNode.range[0] + 1, pathValueNode.range[1] - 1],
                    convertRoutePathToKebabCase(pathValueNode.value)
                  );
                },
              },
            ],
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

function getStaticURLSegments(path) {
  return path.split('/').filter((segment) => isStaticSegment(segment));
}

function isDynamicSegment(segment) {
  return segment.includes(':');
}

function isWildcardSegment(segment) {
  return segment.includes('*');
}

function isStaticSegment(segment) {
  return !isDynamicSegment(segment) && !isWildcardSegment(segment) && segment !== '';
}

const KEBAB_CASE_REGEXP = /^[\da-z-]+$/;
function isKebabCase(str) {
  return str.match(KEBAB_CASE_REGEXP);
}

function convertRoutePathToKebabCase(path) {
  return path
    .split('/')
    .map((segment) => (isStaticSegment(segment) ? kebabCase(segment) : segment))
    .join('/');
}
