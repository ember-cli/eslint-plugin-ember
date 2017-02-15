'use strict';

var utils = require('../utils/utils');
var ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Controllers - Alias your model
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Alias your model';

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if (!ember.isEmberController(node)) return;

      var properties = ember.getModuleProperties(node);
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
