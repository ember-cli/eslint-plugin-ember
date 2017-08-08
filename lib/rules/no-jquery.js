'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule -  Disallow usage of jQuery
//------------------------------------------------------------------------------

const message = 'Do not use `this.$` in components or tests, as it uses jQuery underneath.';
function isThisJquery(node) {
  return utils.isMemberExpression(node.callee) &&
    utils.isThisExpression(node.callee.object) &&
    node.callee.property.name === '$';
}

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of `this.$` on components or tests',
      category: 'Components & tests',
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    message
  },
  create(context) {
    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (isThisJquery(node)) {
          report(node, message);
        }
      }
    };
  }
};
