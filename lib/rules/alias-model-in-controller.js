'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Controllers - Alias your model
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce aliasing model in controllers',
      category: 'Controllers',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/alias-model-in-controller.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = 'Alias your model';

    const report = function (node) {
      context.report({ node, message });
    };

    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    return {
      CallExpression(node) {
        if (!ember.isEmberController(context, node)) {
          return;
        }

        const properties = ember.getModuleProperties(node, scopeManager);
        let aliasPresent = false;

        for (const property of properties) {
          const parsedCallee = utils.parseCallee(property.value);
          const parsedArgs = utils.parseArgs(property.value);

          if (
            parsedCallee.length > 0 &&
            ['alias', 'readOnly', 'reads'].includes(parsedCallee.pop()) &&
            (parsedArgs[0] === 'model' || String(parsedArgs[0]).startsWith('model.'))
          ) {
            aliasPresent = true;
          }
        }

        if (!aliasPresent) {
          report(node);
        }
      },
    };
  },
};
