'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Controllers - Alias your model
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {}
  },

  create(context) {
    const message = 'Alias your model';

    const report = function (node) {
      context.report(node, message);
    };

    const filePath = context.getFilename();

    return {
      CallExpression(node) {
        if (!ember.isEmberController(node, filePath)) return;

        const properties = ember.getModuleProperties(node);
        let aliasPresent = false;

        properties.forEach((property) => {
          const parsedCallee = utils.parseCallee(property.value);
          const parsedArgs = utils.parseArgs(property.value);

          if (
            parsedCallee.length &&
            ['alias', 'readOnly', 'reads'].includes(parsedCallee.pop()) &&
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
  }
};
