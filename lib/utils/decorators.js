const { getName } = require('./utils');
const types = require('./types');
const assert = require('assert');

module.exports = {
  getDecoratorName,
  getDecorator,
  findDecorator,
  findDecoratorByNameCallback,
  hasDecorator,
  isClassPropertyOrPropertyDefinitionWithDecorator,
};

/**
 * @param {node} node - decorator
 * @returns {string} - name of decorator (i.e. `computed`, `computed.readOnly`)
 */
function getDecoratorName(node) {
  assert(types.isDecorator(node), 'must call this function on a Decorator');
  return getName(node.expression);
}

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
    node.decorators.find((decorator) => getDecoratorName(decorator) === decoratorName)
  );
}

/**
 * Finds the decorator that returns true for the given decorator name callback function.
 *
 * @param {Node} node The node to check.
 * @param {function} callback The callback function to check against each decorator name.
 * @returns {Node} The decorator found.
 */
function findDecoratorByNameCallback(node, callback) {
  return (
    node.decorators && node.decorators.find((decorator) => callback(getDecoratorName(decorator)))
  );
}

/**
 * Check whether or not a node has at least the given decorator
 *
 * @param {Object} node The node to check.
 * @param {string?} decoratorName The decorator to look for
 * @returns {boolean} Whether or not the node has the given decorator.
 */
function hasDecorator(node, decoratorName) {
  if (!node.decorators) {
    return false;
  }

  return node.decorators.some((decorator) => getDecoratorName(decorator) === decoratorName);
}

/**
 * Get applied decorator node for the given decorator type
 *
 * @param {Object} node The node to check.
 * @param {string?} decoratorName The decorator to look for
 * @returns {Node} Node for the decorator
 */
function getDecorator(node, decoratorName) {
  if (!node.decorators) {
    return null;
  }

  return node.decorators.find((decorator) => getDecoratorName(decorator) === decoratorName);
}

/**
 * Check whether or not a node is a ClassProperty / PropertyDefinition, with at least the given decorator.
 * If no decoratorName is provided, will return whether the node has any decorators at all
 *
 * @param {Object} node The node to check.
 * @param {string?} decoratorName The decorator to look for
 * @returns {boolean} Whether or not the node is a ClassProperty / PropertyDefinition with the given decorator.
 */
function isClassPropertyOrPropertyDefinitionWithDecorator(node, decoratorName) {
  return types.isClassPropertyOrPropertyDefinition(node) && hasDecorator(node, decoratorName);
}
