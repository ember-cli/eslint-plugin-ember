'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

//------------------------------------------------------------------------------
// General rule - Alias your model
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Alias your model';

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if (!ember.isEmberController(node)) return;

      var callee = node.callee;
      var properties = node.arguments[0].properties;
      var aliasPresent = false;

      properties.forEach(function(property) {
        var parsedCallee = utils.parseCallee(property.value);
        var parsedArgs = utils.parseArgs(property.value);

        if (
          parsedCallee.length &&
          parsedCallee.pop() === 'alias' &&
          parsedArgs[0] === 'model'
        ) {
          aliasPresent = true;
        }
      });


      if (!aliasPresent) {
        report(node)
      }
    }
  };

};
