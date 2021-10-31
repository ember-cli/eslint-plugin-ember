'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const { snakeCase } = require('snake-case');
const { getNodeOrNodeFromVariable } = require('../utils/utils');

//------------------------------------------------------------------------------
// Routing - Snake case in dynamic segments of routes
//------------------------------------------------------------------------------

const isNotSnakeCase = function (name) {
  return snakeCase(name) !== name;
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of snake_cased dynamic segments in routes',
      category: 'Routes',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/routes-segments-snake-case.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = 'Use snake case in dynamic segments of routes';
    const routeSegmentRegex = /:([\w-]+)/g;

    const report = function (node) {
      context.report({ node, message });
    };

    const isSegment = function (property) {
      return (
        types.isProperty(property) &&
        types.isIdentifier(property.key) &&
        property.key.name === 'path' &&
        routeSegmentRegex.test(property.value.value)
      );
    };

    const getSegmentNames = function (property) {
      if (!isSegment(property)) {
        return [];
      }

      return property.value.value.match(routeSegmentRegex).map((segment) => segment.slice(1));
    };

    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    return {
      CallExpression(node) {
        if (!ember.isRoute(node)) {
          return;
        }

        let optionsNode;
        const routeOptions =
          node.arguments.length >= 2 &&
          (optionsNode = getNodeOrNodeFromVariable(node.arguments[1], scopeManager)) &&
          optionsNode.type === 'ObjectExpression'
            ? optionsNode
            : false;

        if (routeOptions) {
          for (const property of routeOptions.properties) {
            const segmentNames = getSegmentNames(property);

            if (segmentNames.some(isNotSnakeCase)) {
              report(property.value);
            }
          }
        }
      },
    };
  },
};
