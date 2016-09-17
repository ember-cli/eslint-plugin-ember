'use strict';

var utils = require('./utils/utils');

//----------------------------------------------------------------------------------------------
// General rule - Don't use Ember's function prototype extensions like .property() or .observe()
//----------------------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Don\'t use Ember\'s function prototype extensions';

  var functionPrototypeExtensionNames = ['property', 'observe', 'on'];

  var isFunctionPrototypeExtension = function (property) {
    return utils.isIdentifier(property) && functionPrototypeExtensionNames.indexOf(property.name) !== -1;
  };

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      var callee = node.callee;

      if (
        utils.isCallExpression(node) &&
        utils.isMemberExpression(callee) &&
        utils.isFunctionExpression(callee.object) &&
        isFunctionPrototypeExtension(callee.property)
      ) {
        report(node);
      }
    }
  };
};
