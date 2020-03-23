'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const { snakeCase } = require('snake-case');

//------------------------------------------------------------------------------
// Routing - Snake case in dynamic segments of routes
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of snake_cased dynamic segments in routes',
      category: 'Possible Errors',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/routes-segments-snake-case.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = 'Use snake case in dynamic segments of routes';
    const routeSegmentRegex = /:([\w-]+)/g;

    const report = function (node) {
      context.report(node, message);
    };

    const isSegment = function (property) {
      return property.key.name === 'path' && routeSegmentRegex.test(property.value.value);
    };

    const getSegmentNames = function (property) {
      if (!isSegment(property)) {
        return [];
      }

      return property.value.value.match(routeSegmentRegex).map((segment) => segment.slice(1));
    };

    const isNotSnakeCase = function (name) {
      return snakeCase(name) !== name;
    };

    return {
      CallExpression(node) {
        if (!ember.isRoute(node)) {
          return;
        }

        const routeOptions = types.isObjectExpression(node.arguments[1])
          ? node.arguments[1]
          : false;

        if (routeOptions) {
          routeOptions.properties.forEach((property) => {
            const segmentNames = getSegmentNames(property);

            if (segmentNames.length > 0 && segmentNames.filter(isNotSnakeCase).length > 0) {
              report(property.value);
            }
          });
        }
      },
    };
  },
};
