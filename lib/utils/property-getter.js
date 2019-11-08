const types = require('./types');

/**
 * Checks if a CallExpression node looks like `this.get('property')`.
 *
 * @param {Node} node The CallExpression node to check.
 * @returns {boolean} Whether the node looks like `this.get('property')`.
 */
function isThisGetCall(node) {
  if (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isThisExpression(node.callee.object) &&
    types.isIdentifier(node.callee.property) &&
    node.callee.property.name === 'get' &&
    node.arguments.length === 1 &&
    types.isStringLiteral(node.arguments[0])
  ) {
    // Looks like: this.get('property')
    return true;
  }

  return false;
}

/**
 * Checks if a MemberExpression node looks like `this.x` or `this.x.y` or `this.get('x')`.
 *
 * @param {Node} node The MemberExpression node to check.
 * @returns {boolean} Whether the node looks like `this.x` or `this.x.y` or `this.get('x')`.
 */
function isSimpleThisExpression(node) {
  if (isThisGetCall(node)) {
    return true;
  }

  if (!types.isMemberExpression(node)) {
    return false;
  }

  let current = node;
  while (current !== null) {
    if (types.isMemberExpression(current) && !current.computed) {
      if (!types.isIdentifier(current.property)) {
        return false;
      }
      current = current.object;
    } else if (types.isThisExpression(current)) {
      return true;
    } else {
      return false;
    }
  }

  return false;
}

function removeWhitespace(str) {
  // Removes whitespace anywhere inside string.
  return str.replace(/\s/g, '');
}

/**
 * Converts a Node containing a ThisExpression to its dependent key.
 *
 * Example Input:   A Node with this source code: `this.x.y` or `this.get('x')`
 * Example Output:  'x.y'
 *
 * @param {Node} node a MemberExpression node that looks like `this.x.y` or `this.get('x')`.
 * @returns {String} The dependent key of the input node (without `this.`).
 */
function nodeToDependentKey(nodeWithThisExpression, context) {
  if (types.isCallExpression(nodeWithThisExpression)) {
    // Looks like: this.get('property')
    return nodeWithThisExpression.arguments[0].value;
  }

  const sourceCode = context.getSourceCode();
  return removeWhitespace(sourceCode.getText(nodeWithThisExpression).replace(/^this\./, ''));
}

module.exports = {
  nodeToDependentKey,
  isSimpleThisExpression,
  isThisGetCall,
};
