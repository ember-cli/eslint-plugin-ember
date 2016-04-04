module.exports = {
  findNodes: findNodes,
  isMemberExpression: isMemberExpression,
  isCallExpression: isCallExpression,
  isIdentifier: isIdentifier,
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
 * Check whether or not a node is an Identifier.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Identifier.
 */
function isIdentifier(node) {
    return node !== undefined && node.type === 'Identifier';
}

