const types = require('./types');

module.exports = {
  isThisSet,
};

/**
 * Checks if an AssignmentExpression looks like `this.x =` or `this.x.y =`.
 *
 * @param {Node} node The AssignmentExpression node to check.
 * @returns {boolean} Whether the node looks as expected.
 */
function isThisSet(node) {
  if (!types.isAssignmentExpression(node)) {
    return false;
  }

  let current = node.left;
  if (!types.isMemberExpression(current)) {
    return false;
  }
  while (types.isMemberExpression(current.object)) {
    current = current.object;
  }
  if (!types.isThisExpression(current.object)) {
    return false;
  }

  return true;
}
