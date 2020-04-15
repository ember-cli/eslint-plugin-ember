'use strict';

const types = require('./types');

module.exports = {
  removeCommaSeparatedNode,
};

function removeCommaSeparatedNode(node, sourceCode, fixer) {
  const tokenBefore = sourceCode.getTokenBefore(node);
  const tokenAfter = sourceCode.getTokenAfter(node);

  const removeComma = types.isCommaToken(tokenAfter)
    ? fixer.remove(tokenAfter)
    : fixer.remove(tokenBefore);
  const removeNode = fixer.remove(node);

  return [removeComma, removeNode];
}
