const types = require('./types');

module.exports = {
  findDecorator,
  hasDecorator,
  isClassPropertyWithDecorator,
};

/**
 * Finds the decorator with the given name.
 *
 * @param {Node} node The node to check.
 * @param {string} decoratorName The decorator name to look for.
 * @returns {Node} The decorator found.
 */
function findDecorator(node, decoratorName) {
  return (
    node.decorators &&
    node.decorators.find(
      (decorator) =>
        (types.isIdentifier(decorator.expression) && decorator.expression.name === decoratorName) ||
        (types.isCallExpression(decorator.expression) &&
          types.isIdentifier(decorator.expression.callee) &&
          decorator.expression.callee.name === decoratorName)
    )
  );
}

/**
 * Check whether or not a node has at least the given decorator
 * If no decoratorName is provided, will return whether the node has any decorators at all
 *
 * @param {Object} node The node to check.
 * @param {string?} decoratorName The decorator to look for
 * @returns {boolean} Whether or not the node has the given decorator.
 */
function hasDecorator(node, decoratorName) {
  if (!node.decorators) {
    return false;
  }
  if (!decoratorName) {
    return true;
  }

  return node.decorators.some((decorator) => {
    const expression = decorator.expression;
    return (
      (types.isIdentifier(expression) && expression.name === decoratorName) ||
      (types.isCallExpression(expression) && expression.callee.name === decoratorName)
    );
  });
}

/**
 * Check whether or not a node is a ClassProperty, with at least the given decorator.
 * If no decoratorName is provided, will return whether the node has any decorators at all
 *
 * @param {Object} node The node to check.
 * @param {string?} decoratorName The decorator to look for
 * @returns {boolean} Whether or not the node is a ClassProperty with the given decorator.
 */
function isClassPropertyWithDecorator(node, decoratorName) {
  return types.isClassProperty(node) && hasDecorator(node, decoratorName);
}
