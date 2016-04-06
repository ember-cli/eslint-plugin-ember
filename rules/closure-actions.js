'use strict';

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// Components - Closure actions
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use closure actions, unless you need bubbling';

  var report = function(node) {
    context.report(node, message);
  };

  return {
    MemberExpression: function(node) {
      var isSendAction = utils.isThisExpression(node.object) &&
        utils.isIdentifier(node.property) &&
        node.property.name === 'sendAction';

      if (isSendAction) {
        report(node);
      }
    }
  };

};
