'use strict';

var utils = require('./utils/utils');
var snakeCase = require('snake-case');

//------------------------------------------------------------------------------
// Routing - Snake case in dynamic segments of routes
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use snake case in dynamic segments of routes';

  var report = function(node) {
    context.report(node, message);
  };

  var isRoute = function(node) {
    return utils.isMemberExpression(node.callee) &&
      utils.isThisExpression(node.callee.object) &&
      utils.isIdentifier(node.callee.property) &&
      node.callee.property.name === 'route';
  };

  var isSegment = function(property) {
    return property.key.name === 'path' && property.value.value.indexOf(':') > -1;
  };

  var getSegmentName = function(property) {
    if (!isSegment(property)) return;
    return property.value.value.split(':')[1];
  };

  var isSnakeCase = function(name) {
    return snakeCase(name) === name;
  };

  return {
    CallExpression: function(node) {
      if (!isRoute(node)) return;

      var hasOptions = node.arguments.length > 1 && utils.isObjectExpression(node.arguments[1]);
      var routeOptions = hasOptions ? node.arguments[1] : false;

      if (routeOptions) {
        routeOptions.properties.forEach(function(property) {
          var segmentName = getSegmentName(property);
          if (segmentName && !isSnakeCase(segmentName)) {
            report(property.value);
          }
        });
      }
    }
  };

};
