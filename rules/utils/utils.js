module.exports = {
  findNodes: findNodes,
  isIdentifier: isIdentifier,
  isLiteral: isLiteral,
  isMemberExpression: isMemberExpression,
  isCallExpression: isCallExpression,
  isObjectExpression: isObjectExpression,
  getSize: getSize,
};

/**
 * Find nodes of given name
 *
 * @param  {Array} body Array of nodes
 * @param  {String} nodeName
 * @return {Array}
 */
function findNodes(body, nodeName) {
    var nodesArray = [];

    if (body) {
      nodesArray = body.filter(function (node) {
        return node.type === nodeName;
      });
    }

    return nodesArray;
}

/**
 * Check whether or not a node is an Identifier.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Identifier.
 */
function isIdentifier(node) {
    return node !== undefined && node.type === 'Identifier';
}

/**
 * Check whether or not a node is an Literal.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Literal.
 */
function isLiteral(node) {
    return node !== undefined && node.type === 'Literal';
}

/**
 * Check whether or not a node is an MemberExpression.
 *
 * @param {Object} node The node to check.
 * @return {boolean} Whether or not the node is an MemberExpression.
 */
function isMemberExpression(node) {
    return node !== undefined && node.type === 'MemberExpression';
}

/**
 * Check whether or not a node is an CallExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an CallExpression.
 */
function isCallExpression(node) {
    return node !== undefined && node.type === 'CallExpression';
}

/**
 * Check whether or not a node is an ObjectExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ObjectExpression.
 */
function isObjectExpression(node) {
    return node !== undefined && node.type === 'ObjectExpression';
}

/**
 * Get size of expression in lines
 *
 * @param  {Object} node The node to check.
 * @return {Integer} Number of lines
 */
function getSize(node) {
  return node.loc.end.line - node.loc.start.line + 1;
}
