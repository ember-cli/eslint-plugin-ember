'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// Components - Closure actions
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces usage of closure actions',
      category: 'Components',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Use closure actions, unless you need bubbling';

    const report = function (node) {
      context.report(node, message);
    };

    return {
      MemberExpression(node) {
        const isSendAction = utils.isThisExpression(node.object) &&
          utils.isIdentifier(node.property) &&
          node.property.name === 'sendAction';

        if (isSendAction) {
          report(node);
        }
      },
    };
  }
};
