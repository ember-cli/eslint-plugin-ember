

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// Components - Closure actions
//------------------------------------------------------------------------------

module.exports = function (context) {
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
};
