

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Controllers - Alias your model
//------------------------------------------------------------------------------

module.exports = function (context) {
  const message = 'Alias your model';

  const report = function (node) {
    context.report(node, message);
  };

  return {
    CallExpression(node) {
      if (!ember.isEmberController(node)) return;

      const properties = ember.getModuleProperties(node);
      let aliasPresent = false;

      properties.forEach((property) => {
        const parsedCallee = utils.parseCallee(property.value);
        const parsedArgs = utils.parseArgs(property.value);

        if (
          parsedCallee.length &&
          parsedCallee.pop() === 'alias' &&
          parsedArgs[0] === 'model'
        ) {
          aliasPresent = true;
        }
      });


      if (!aliasPresent) {
        report(node);
      }
    },
  };
};
