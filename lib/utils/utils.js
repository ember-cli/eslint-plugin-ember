'use strict';

module.exports = {
  findNodes,
  isIdentifier,
  isLiteral,
  isMemberExpression,
  isCallExpression,
  isObjectExpression,
  isArrayExpression,
  isFunctionExpression,
  isArrowFunctionExpression,
  isConciseArrowFunctionWithCallExpression,
  isNewExpression,
  isCallWithFunctionExpression,
  isThisExpression,
  isConditionalExpression,
  getSize,
  parseCallee,
  parseArgs,
  findUnorderedProperty,
};

/**
 * Find nodes of given name
 *
 * @param  {Array} body Array of nodes
 * @param  {String} nodeName
 * @return {Array}
 */
function findNodes(body, nodeName) {
  let nodesArray = [];

  if (body) {
    nodesArray = body.filter(node => node.type === nodeName);
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
 * Check whether or not a node is an ArrowFunctionExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ArrowFunctionExpression.
 */
function isArrowFunctionExpression(node) {
  return node !== undefined && node.type === 'ArrowFunctionExpression';
}

/**
 * Check whether or not a node is an ArrowFunctionExpression with concise body
 * that contains a call expression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ArrowFunctionExpression
 * with concise body.
 */
function isConciseArrowFunctionWithCallExpression(node) {
  return isArrowFunctionExpression(node) &&
    node.expression &&
    isCallExpression(node.body);
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
  const callObj = isMemberExpression(node.callee) ? node.callee.object : node;
  const firstArg = callObj.arguments ? callObj.arguments[0] : null;
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
 * Check whether or not a node is a ConditionalExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a ConditionalExpression.
 */
function isConditionalExpression(node) {
  return node !== undefined && node.type === 'ConditionalExpression';
}

/**
 * Get size of expression in lines
 *
 * @param  {Object} node The node to check.
 * @return {Integer} Number of lines
 */
function getSize(node) {
  return (node.loc.end.line - node.loc.start.line) + 1;
}

/**
 * Parse CallExpression or NewExpression to get array of properties and object name
 *
 * @param  {Object} node The node to parse
 * @return {Array} eg. ['Ember', 'computed', 'alias']
 */
function parseCallee(node) {
  const parsedCallee = [];
  let callee;

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
  let parsedArgs = [];

  if (isCallExpression(node)) {
    parsedArgs = node.arguments
      .filter(argument => isLiteral(argument) && argument.value)
      .map(argument => argument.value);
  }

  return parsedArgs;
}

/**
 * Find property that is in wrong order
 *
 * @param  {Array} arr Properties with their order value
 * @return {Object}    Unordered property or null
 */
function findUnorderedProperty(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].order > arr[i + 1].order) {
      return arr[i];
    }
  }

  return null;
}
