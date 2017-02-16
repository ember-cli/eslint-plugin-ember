'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Ember Data - Be explicit with Ember data attribute types
//------------------------------------------------------------------------------

module.exports = function (context) {
  const message = 'Supply proper attribute type';

  const report = function (node) {
    context.report(node, message);
  };

  return {
    CallExpression(node) {
      if (!ember.isDSModel(node)) return;

      const allProperties = ember.getModuleProperties(node);
      const propertiesWithEmptyAttrs = allProperties.filter(property =>
        ember.isModule(property.value, 'attr', 'DS') &&
        !property.value.arguments.length);

      if (propertiesWithEmptyAttrs.length) {
        report(node);
      }
    },
  };
};
