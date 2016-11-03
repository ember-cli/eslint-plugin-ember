module.exports = {
  findNodes: findNodes,
  isIdentifier: isIdentifier,
  isLiteral: isLiteral,
  isMemberExpression: isMemberExpression,
  isCallExpression: isCallExpression,
  isObjectExpression: isObjectExpression,
  isArrayExpression: isArrayExpression,
  isFunctionExpression: isFunctionExpression,
  isNewExpression: isNewExpression,
  isCallWithFunctionExpression: isCallWithFunctionExpression,
  isThisExpression: isThisExpression,
  getSize: getSize,
  parseCallee: parseCallee,
  parseArgs: parseArgs,
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
 * Check whether or not a node is an ArrayExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ArrayExpression.
 */
function isArrayExpression(node) {
  return node !== undefined && node.type === 'ArrayExpression';
}

/**
 * Check whether or not a node is an FunctionExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an FunctionExpression.
 */
function isFunctionExpression(node) {
  return node !== undefined && node.type === 'FunctionExpression';
}

/**
 * Check whether or not a node is an NewExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an NewExpression.
 */
function isNewExpression(node) {
  return node !== undefined && node.type === 'NewExpression';
}

/**
 * Check whether or not a node is a CallExpression that has a FunctionExpression
 * as first argument, eg.:
 * tSomeAction: mysteriousFnc(function(){})
 *
 * @param  {[type]}  node [description]
 * @return {Boolean}      [description]
 */
function isCallWithFunctionExpression(node) {
  var callObj = isMemberExpression(node.callee) ? node.callee.object : node;
  var firstArg = callObj.arguments ? callObj.arguments[0] : null;
  return callObj !== undefined && isCallExpression(callObj) &&
    firstArg && isFunctionExpression(firstArg);
}

/**
 * Check whether or not a node is an ThisExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ThisExpression.
 */
function isThisExpression(node) {
    return node !== undefined && node.type === 'ThisExpression';
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

/**
 * Parse CallExpression or NewExpression to get array of properties and object name
 *
 * @param  {Object} node The node to parse
 * @return {Array} eg. ['Ember', 'computed', 'alias']
 */
function parseCallee(node) {
  var parsedCallee = [];
  var callee;

  if (isCallExpression(node) || isNewExpression(node)) {
    callee = node.callee;

    while (isMemberExpression(callee)) {
      if (isIdentifier(callee.property)) {
        parsedCallee.push(callee.property.name);
      }
      callee = callee.object;
    }

    if (isIdentifier(callee)) {
      parsedCallee.push(callee.name);
    }
  }

  return parsedCallee.reverse();
}

/**
 * Parse CallExpression to get array of arguments
 *
 * @param  {Object} node Node to parse
 * @return {Array} Literal function's arguments
 */
function parseArgs(node) {
  var parsedArgs = [];

  if (isCallExpression(node)) {
    parsedArgs = node.arguments.filter(function(argument) {
      return isLiteral(argument) ? argument.value : false;
    }).map(function(argument) {
      return argument.value;
    });
  }

  return parsedArgs;
}
