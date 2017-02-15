'use strict';

var ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = "Don't use observers if possible";

  var report = function(node) {
    context.report(node, message);
  };

  return {
    CallExpression: function(node) {
      if(ember.isModule(node, 'observer')) {
        report(node);
      }
    }
  };
};
