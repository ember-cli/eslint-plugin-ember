const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Controllers - Query params should always be on top
//------------------------------------------------------------------------------

module.exports = function (context) {
  const message = 'Query params should always be on top';

  const report = function (node) {
    context.report(node, message);
  };

  return {
    CallExpression(node) {
      if (!ember.isEmberController(node)) return;

      const properties = ember.getModuleProperties(node);

      const propKeys = properties.map(property => property.key.name);

      if (propKeys.indexOf('queryParams') > 0) {
        report(node);
      }
    },
  };
};
