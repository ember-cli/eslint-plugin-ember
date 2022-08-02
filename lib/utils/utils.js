'use strict';

const {
  isAssignmentExpression,
  isCallExpression,
  isIdentifier,
  isLiteral,
  isMemberExpression,
  isNewExpression,
  isObjectPattern,
  isOptionalCallExpression,
  isOptionalMemberExpression,
  isThisExpression,
} = require('../utils/types');
const { findVariable } = require('eslint-utils');

module.exports = {
  collectObjectPatternBindings,
  findNodes,
  findUnorderedProperty,
  getAncestor,
  getName,
  getNodeOrNodeFromVariable,
  getPropertyValue,
  getSize,
  isEmptyMethod,
  isInLeftSideOfAssignmentExpression,
  parseArgs,
  parseCallee,
  startsWithThisExpression,
};

/**
 * Find nodes of given name
 *
 * @param  {Node[]} body Array of nodes
 * @param  {String} nodeName
 * @return {Node[]}
 */
function findNodes(body, nodeName) {
  let nodesArray = [];

  if (body) {
    nodesArray = body.filter((node) => node.type === nodeName);
  }

  return nodesArray;
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
 * @return {String[]} eg. ['Ember', 'computed', 'alias']
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
 * @return {String[]} Literal function's arguments
 */
function parseArgs(node) {
  let parsedArgs = [];

  if (isCallExpression(node)) {
    parsedArgs = node.arguments
      .filter((argument) => isLiteral(argument) && argument.value)
      .map((argument) => argument.value);
  }

  return parsedArgs;
}

/**
 * Find property that is in wrong order
 *
 * @param  {Object[]} arr Properties with their order value
 * @return {Object}       Unordered property or null
 */
function findUnorderedProperty(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].order > arr[i + 1].order) {
      return arr[i];
    }
  }

  return null;
}

/**
 * Gets a property's value either by property path.
 *
 * @example
 * getPropertyValue('name');
 * getPropertyValue('parent.key.name');
 *
 * @param {Object} node
 * @param {String} path
 * @returns
 */
function getPropertyValue(node, path) {
  const parts = typeof path === 'string' ? path.split('.') : path;

  if (parts.length === 1) {
    return node[path];
  }

  const property = node[parts[0]];

  if (property && parts.length > 1) {
    parts.shift();
    return getPropertyValue(property, parts);
  }

  return property;
}

/**
 * Find deconstructed bindings based on the initialObjToBinding hash.
 *
 * Extracts the names of destructured properties, even if they are aliased.
 * `initialObjToBinding` should should have variable names as keys and bindings array as values.
 * Given `const { $: foo } = Ember` it will return `['foo']`.
 *
 * @param  {VariableDeclarator} node node to parse
 * @param  {Object}             initialObjToBinding relevant bindings
 * @return {String[]}           list of object pattern bindings
 */
function collectObjectPatternBindings(node, initialObjToBinding) {
  if (!isObjectPattern(node.id)) {
    return [];
  }

  const identifiers = Object.keys(initialObjToBinding);
  const objBindingName = node.init.name;
  const bindingIndex = identifiers.indexOf(objBindingName);
  if (bindingIndex === -1) {
    return [];
  }

  const binding = identifiers[bindingIndex];

  return node.id.properties
    .filter((props) => initialObjToBinding[binding].includes(props.key.name))
    .map((props) => props.value.name);
}

/**
 * Check whether or not a node is a empty method.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an empty method.
 */
function isEmptyMethod(node) {
  return node.value.body && node.value.body.body && node.value.body.body.length <= 0;
}

/**
 * Travels up the ancestors of a given node, if the predicate function returns
 * truthy for a given node or ancestor, return that node, otherwise return null
 *
 * @name getAncestor
 * @param {Object} node The child node to start at
 * @param {Function} predicate Function that should return a boolean for a given value
 * @returns {Object|null} The first node that matches predicate, otherwise null
 */
function getAncestor(node, predicate) {
  let currentNode = node;
  while (currentNode) {
    if (predicate(currentNode)) {
      return currentNode;
    }

    currentNode = currentNode.parent;
  }

  return null;
}

/**
 * Examples:
 * x -> x
 * x() -> x
 * x.y -> x.y
 * x.y() -> x.y
 *
 * @param {node} node
 * @param {boolean=false} includeFunctionCallParens - whether to include parenthesis () to distinguish function calls from objects/properties
 * @returns {string}
 */
function getName(node, includeFunctionCallParens = false) {
  if (isIdentifier(node)) {
    return node.name;
  } else if (isCallExpression(node) || isOptionalCallExpression(node)) {
    return `${getName(node.callee, includeFunctionCallParens)}${
      includeFunctionCallParens ? '()' : ''
    }`;
  } else if (isMemberExpression(node) || isOptionalMemberExpression(node)) {
    return `${getName(node.object, includeFunctionCallParens)}.${getName(
      node.property,
      includeFunctionCallParens
    )}`;
  } else if (node.type === 'ChainExpression') {
    return getName(node.expression, includeFunctionCallParens);
  }
  return undefined;
}

/**
 * Return the passed in node, or if the node is a variable, return the value of this variable.
 *
 * Example:
 *   Calling the function on `{ foo: true }` will return the same node.
 * Example:
 *   const x = { foo: true };
 *   Calling the function on `x` will return the ObjectExpression value.
 *
 * @param {Node} node
 * @param {ScopeManager} scopeManager
 * @returns {Node | null}
 */
function getNodeOrNodeFromVariable(node, scopeManager) {
  if (node.type === 'Identifier') {
    // Find the definition of this variable.
    const variable = findVariable(scopeManager.acquire(node) || scopeManager.globalScope, node);
    if (
      variable &&
      variable.defs &&
      variable.defs[0] &&
      variable.defs[0].node &&
      variable.defs[0].node.type === 'VariableDeclarator' &&
      variable.defs[0].node.init
    ) {
      return variable.defs[0].node.init;
    }
  }

  // If the node isn't a variable or we can't find the initialized value of it, just return the node itself.
  return node;
}

/**
 * Check whether a node is inside the left side of an AssignmentExpression.
 *
 * Example:
 * - this.x.y = 123;
 * Nodes in the left side of this example:
 * - this
 * - x
 * - y
 *
 * @param {Node} node - node to check
 * @returns {boolean} - whether the node is inside the left side of the given AssignmentExpression
 */
function isInLeftSideOfAssignmentExpression(node) {
  return Boolean(
    getAncestor(
      node,
      (ancestor) =>
        ancestor.parent &&
        isAssignmentExpression(ancestor.parent) &&
        ancestor === ancestor.parent.left
    )
  );
}

function startsWithThisExpression(node) {
  if (isCallExpression(node) && node.callee) {
    return startsWithThisExpression(node.callee);
  } else if (isMemberExpression(node) && node.object) {
    return startsWithThisExpression(node.object);
  } else if (isIdentifier(node)) {
    return false;
  } else if (isThisExpression(node)) {
    return true;
  }
  return false;
}
