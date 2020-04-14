const types = require('./types');
const assert = require('assert');

module.exports = {
  getComputedPropertyFunctionBody,
};

/**
 * Gets the function body of the computed property.
 *
 * Handles:
 * * computed('prop1', 'prop2', function() { ... })
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
    computedPropertyFunctionBody = lastArg.body;
  } else if (types.isObjectExpression(lastArg)) {
    const getFunction = lastArg.properties.find(
      (property) =>
        property.method && types.isIdentifier(property.key) && property.key.name === 'get'
    );
    if (getFunction) {
      computedPropertyFunctionBody = getFunction.value.body;
    }
  }
  return computedPropertyFunctionBody;
}
