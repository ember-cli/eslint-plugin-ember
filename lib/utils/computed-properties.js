const types = require('./types');
const assert = require('assert');

module.exports = {
  isComputedPropertyBodyArg,
  getComputedPropertyFunctionBody,
};

/**
 * Checks whether a computed property argument is the type of node that could contain the
 * function body of the computed property (which would be passed as the last arg).
 *
 * Handles:
 * * computed('prop1', 'prop2', function() { ... })
 * * computed('prop1', 'prop2', () => { ... })
 * * computed('prop1', 'prop2', { get() { ... } })
 *
 * @param {ASTNode} node - computed property argument to check
 * @returns {boolean} whether the node could be the function body argument of a computed property
 */
function isComputedPropertyBodyArg(node) {
  return (
    types.isFunctionExpression(node) ||
    types.isArrowFunctionExpression(node) ||
    types.isObjectExpression(node)
  );
}

/**
 * Gets the function body of the computed property.
 *
 * Handles:
 * * computed('prop1', 'prop2', function() { ... })
 * * computed('prop1', 'prop2', () => { ... })
 * * computed('prop1', 'prop2', { get() { ... } })
 *
 * @param {ASTNode} node - computed property CallExpression node
 * @returns {ASTNode} function body of computed property
 */
function getComputedPropertyFunctionBody(node) {
  assert(types.isCallExpression(node), 'Should only call this function on a CallExpression');

  const lastArg = node.arguments[node.arguments.length - 1];

  let computedPropertyFunctionBody = undefined;
  if (types.isArrowFunctionExpression(lastArg) || types.isFunctionExpression(lastArg)) {
    // Example: computed('prop1', 'prop2', function() { ... })
    // Example: computed('prop1', 'prop2', () => { ... })
    computedPropertyFunctionBody = lastArg.body;
  } else if (types.isObjectExpression(lastArg)) {
    // Example: computed('prop1', 'prop2', { get() { ... } })
    const getFunction = lastArg.properties.find(
      (property) =>
        property.method && types.isIdentifier(property.key) && property.key.name === 'get'
    );
    if (getFunction) {
      computedPropertyFunctionBody = getFunction.value.body;
    }
  } else if (
    types.isDecorator(node.parent) &&
    types.isMethodDefinition(node.parent.parent) &&
    node.parent.parent.kind === 'get'
  ) {
    // Example: @computed('first', 'last') get fullName() {}
    computedPropertyFunctionBody = node.parent.parent.value.body;
  }

  return computedPropertyFunctionBody;
}
