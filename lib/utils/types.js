'use strict';

module.exports = {
  isAnyFunctionExpression,
  isArrayExpression,
  isArrowFunctionExpression,
  isBinaryExpression,
  isCallExpression,
  isCallWithFunctionExpression,
  isClassDeclaration,
  isClassProperty,
  isClassPropertyWithDecorator,
  isConciseArrowFunctionWithCallExpression,
  isConditionalExpression,
  isDecorator,
  isExpressionStatement,
  isFunctionDeclaration,
  isFunctionExpression,
  isIdentifier,
  isImportDeclaration,
  isImportDefaultSpecifier,
  isLiteral,
  isLogicalExpression,
  isMemberExpression,
  isMethodDefinition,
  isMethodDefinitionWithDecorator,
  isNewExpression,
  isObjectExpression,
  isObjectPattern,
  isProperty,
  isReturnStatement,
  isString,
  isStringLiteral,
  isTaggedTemplateExpression,
  isTemplateLiteral,
  isThisExpression,
  isUnaryExpression,
  isVariableDeclarator,
};

/**
 * Check whether or not a node is an ArrowFunctionExpression or FunctionExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ArrowFunctionExpression or FunctionExpression.
 */
function isAnyFunctionExpression(node) {
  return isArrowFunctionExpression(node) || isFunctionExpression(node);
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
 * Check whether or not a node is an ArrowFunctionExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ArrowFunctionExpression.
 */
function isArrowFunctionExpression(node) {
  return node !== undefined && node.type === 'ArrowFunctionExpression';
}

/**
 * Check whether or not a node is an BinaryExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an BinaryExpression.
 */
function isBinaryExpression(node) {
  return node !== undefined && node.type === 'BinaryExpression';
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
 * Check whether or not a node is a CallExpression that has a FunctionExpression
 * as first argument, eg.:
 * tSomeAction: mysteriousFnc(function(){})
 *
 * @param  {Object} node The node to check
 * @return {boolean} Whether or not the node is a call with a function expression as the first argument
 */
function isCallWithFunctionExpression(node) {
  const callObj = isMemberExpression(node.callee) ? node.callee.object : node;
  const firstArg = callObj.arguments ? callObj.arguments[0] : null;
  return (
    callObj !== undefined && isCallExpression(callObj) && firstArg && isFunctionExpression(firstArg)
  );
}

/**
 * Check whether or not a node is a ClassDeclaration.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a ClassDeclaration.
 */
function isClassDeclaration(node) {
  return node !== undefined && node.type === 'ClassDeclaration';
}

/**
 * Check whether or not a node is a ClassProperty.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a ClassProperty.
 */
function isClassProperty(node) {
  return node !== undefined && node.type === 'ClassProperty';
}

/**
 * Check whether or not a node is a ClassProperty, with at least the given decorator.
 *
 * @param {Object} node The node to check.
 * @param {string} decoratorName The decorator to look for
 * @returns {boolean} Whether or not the node is a ClassProperty with the given decorator.
 */
function isClassPropertyWithDecorator(node, decoratorName) {
  return isClassProperty(node) && hasDecorator(node, decoratorName);
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
  return isArrowFunctionExpression(node) && node.expression && isCallExpression(node.body);
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
 * Check whether or not a node is a Decorator.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a Decorator.
 */
function isDecorator(node) {
  return node !== undefined && node.type === 'Decorator';
}

/**
 * Check whether or not a node is an ExpressionStatement.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ExpressionStatement.
 */
function isExpressionStatement(node) {
  return node !== undefined && node.type === 'ExpressionStatement';
}

/**
 * Check whether or not a node is a FunctionDeclaration
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a FunctionDeclaration
 */
function isFunctionDeclaration(node) {
  return node !== undefined && node.type === 'FunctionDeclaration';
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
 * Check whether or not a node is an Identifier.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Identifier.
 */
function isIdentifier(node) {
  return node !== undefined && node.type === 'Identifier';
}

/**
 * Check whether or not a node is an ImportDeclaration.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ImportDeclaration.
 */
function isImportDeclaration(node) {
  return node !== undefined && node.type === 'ImportDeclaration';
}

/**
 * Check whether or not a node is an ImportDefaultSpecifier.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ImportDefaultSpecifier.
 */
function isImportDefaultSpecifier(node) {
  return node !== undefined && node.type === 'ImportDefaultSpecifier';
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
 * Check whether or not a node is an LogicalExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an LogicalExpression.
 */
function isLogicalExpression(node) {
  return node !== undefined && node.type === 'LogicalExpression';
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
 * Check whether or not a node is a MethodDefinition.
 *
 * @param {Object} node The node to check.
 * @return {boolean} Whether or not the node is a MethodDefinition.
 */
function isMethodDefinition(node) {
  return node !== undefined && node.type === 'MethodDefinition';
}

/**
 * Check whether or not a node is a MethodDefinition.
 *
 * @param {Object} node The node to check.
 * @param {string} decoratorName The decorator to look for.
 * @return {boolean} Whether or not the node is a MethodDefinition with a decorator.
 */
function isMethodDefinitionWithDecorator(node, decoratorName) {
  return isMethodDefinition(node) && hasDecorator(node, decoratorName);
}

/**
 * Check whether or not a node is an NewExpression.
 *
 * @param {Object} node The node to check.
 * @param {string} decoratorName The decorator to look for.
 * @return {boolean} Whether or not the node has a decorator.
 */
function hasDecorator(node, decoratorName) {
  return (
    node.decorators &&
    node.decorators.some(decorator => {
      const expression = decorator.expression;
      return (
        (isIdentifier(expression) && expression.name === decoratorName) ||
        (isCallExpression(expression) && expression.callee.name === decoratorName)
      );
    })
  );
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
 * Check whether or not a node is an ObjectExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ObjectExpression.
 */
function isObjectExpression(node) {
  return node !== undefined && node.type === 'ObjectExpression';
}

/**
 * Check whether or not a node is an ObjectPattern.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ObjectPattern.
 */
function isObjectPattern(node) {
  return node !== undefined && node.type === 'ObjectPattern';
}

/**
 * Check whether or not a node is an Property.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Property.
 */
function isProperty(node) {
  return node !== undefined && node.type === 'Property';
}

/**
 * Check whether or not a node is a ReturnStatement
 *
 * @param {Object} node The node to check.
 * @return {Boolean} Whether or not the node is a ReturnStatement.
 */
function isReturnStatement(node) {
  return node !== undefined && node.type && node.type === 'ReturnStatement';
}

function isString(node) {
  return isTemplateLiteral(node) || (isLiteral(node) && typeof node.value === 'string');
}

function isStringLiteral(node) {
  return isLiteral(node) && typeof node.value === 'string';
}

/**
 * Check whether or not a node is a TaggedTemplateExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a TaggedTemplateExpression.
 */
function isTaggedTemplateExpression(node) {
  return node !== undefined && node.type === 'TaggedTemplateExpression';
}

/**
 * Check whether or not a node is a TemplateLiteral.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a TemplateLiteral.
 */
function isTemplateLiteral(node) {
  return node !== undefined && node.type === 'TemplateLiteral';
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
 * Check whether or not a node is an UnaryExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Literal.
 */
function isUnaryExpression(node) {
  return node !== undefined && node.type === 'UnaryExpression';
}

/**
 * Check whether or not a node is a VariableDeclarator.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a VariableDeclarator.
 */
function isVariableDeclarator(node) {
  return node !== undefined && node.type === 'VariableDeclarator';
}
