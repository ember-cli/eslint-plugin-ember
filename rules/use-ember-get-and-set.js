'use strict';

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// Common - use get and set
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use get/set';

  var report = function(node) {
    context.report(node, message);
  };

  var asd = [
    'get',
    'set',
    'getProperties',
    'setProperties',
    'toggleProperty',
  ];

  return {
    MemberExpression: function(node) {
      if (
        utils.isIdentifier(node.property) &&
        asd.indexOf(node.property.name) > -1
      ) {
        report(node.property);
      }
    }
  };

};
