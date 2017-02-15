const utils = require('../utils/utils');
const snakeCase = require('snake-case');

//------------------------------------------------------------------------------
// Routing - Snake case in dynamic segments of routes
//------------------------------------------------------------------------------

module.exports = function (context) {
  const message = 'Use snake case in dynamic segments of routes';

  const report = function (node) {
    context.report(node, message);
  };

  const isRoute = function (node) {
    return utils.isMemberExpression(node.callee) &&
      utils.isThisExpression(node.callee.object) &&
      utils.isIdentifier(node.callee.property) &&
      node.callee.property.name === 'route';
  };

  const isSegment = function (property) {
    return property.key.name === 'path' && property.value.value.indexOf(':') > -1;
  };

  const getSegmentNames = function (property) {
    if (!isSegment(property)) return [];

    return property.value.value
      .match(/:([a-zA-Z0-9-_]+)/g)
      .map(segment => segment.slice(1));
  };

  const isNotSnakeCase = function (name) {
    return snakeCase(name) !== name;
  };

  return {
    CallExpression(node) {
      if (!isRoute(node)) return;

      const routeOptions = utils.isObjectExpression(node.arguments[1]) ? node.arguments[1] : false;

      if (routeOptions) {
        routeOptions.properties.forEach((property) => {
          const segmentNames = getSegmentNames(property);

          if (segmentNames.length && segmentNames.filter(isNotSnakeCase).length) {
            report(property.value);
          }
        });
      }
    },
  };
};
