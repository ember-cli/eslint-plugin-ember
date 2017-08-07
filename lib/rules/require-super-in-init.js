'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

//----------------------------------------------
// General rule - Call _super in init lifecycle hooks
//----------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces super calls in init hooks',
      category: 'General',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Call this._super(...arguments) in init hook';

    const filePath = context.getFilename();

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (!ember.isEmberComponent(node, filePath) &&
            !ember.isEmberController(node, filePath) &&
            !ember.isEmberRoute(node, filePath) &&
            !ember.isEmberMixin(node, filePath)) return;

        const initProperty = ember.getModuleProperties(node).find(property => property.key.name === 'init');

        if (initProperty) {
          const initPropertyBody = initProperty.value.body.body;
          const fnExpressions = utils.findNodes(initPropertyBody, 'ExpressionStatement');

          const hasSuper = fnExpressions.some((fnExpression) => {
            const fnCallee = fnExpression.expression.callee;
            return utils.isMemberExpression(fnCallee) &&
              utils.isThisExpression(fnCallee.object) &&
              utils.isIdentifier(fnCallee.property) &&
              fnCallee.property.name === '_super';
          });

          if (!hasSuper) { report(initProperty); }
        }
      },
    };
  }
};
