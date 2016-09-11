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

  var getSegmentNames = function(property) {
    if (!isSegment(property)) return;

    var path = property.value.value;
    var pattern = /:([a-zA-Z0-9-_]+)/g;
    var segmentNames = [];
    var execResult;

    while (execResult = pattern.exec(path)) {
      segmentNames.push(execResult[1]);
    }

    return segmentNames;
  };

  var isNotSnakeCase = function(name) {
    return snakeCase(name) !== name;
  };

  return {
    CallExpression: function(node) {
      if (!isRoute(node)) return;

      var routeOptions = utils.isObjectExpression(node.arguments[1]) ? node.arguments[1] : false;

      if (routeOptions) {
        routeOptions.properties.forEach(function(property) {
          var segmentNames = getSegmentNames(property);

          if (segmentNames && segmentNames.filter(isNotSnakeCase).length) {
            report(property.value);
          }
        });
      }
    }
  };

};
