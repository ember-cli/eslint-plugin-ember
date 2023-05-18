'use strict';

/**
 * Trivial helpers in this file that only check a node's existence and/or type are deprecated in favor of inlining that check.
 * We don't need a function for every type of node.
 * And as written, these functions won't correctly narrow the type of the node, which we would need if we incorporate TypeScript: https://github.com/ember-cli/eslint-plugin-ember/issues/1613
 * TODO: we should inline these trivial checks and only check for node existence when it's actually a possibility a node might not exist.
 */

module.exports = {
  isAnyFunctionExpression,
  isArrayExpression,
  isArrowFunctionExpression,
  isAssignmentExpression,
  isBinaryExpression,
  isCallExpression,
  isCallWithFunctionExpression,
  isClassDeclaration,
  isClassPropertyOrPropertyDefinition,
  isCommaToken,
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
  isNewExpression,
  isObjectExpression,
  isObjectPattern,
  isOptionalCallExpression,
  isOptionalMemberExpression,
  isProperty,
  isReturnStatement,
  isSpreadElement,
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
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isArrayExpression(node) {
  return node !== undefined && node.type === 'ArrayExpression';
}

/**
 * Check whether or not a node is an ArrowFunctionExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ArrowFunctionExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isArrowFunctionExpression(node) {
  return node !== undefined && node.type === 'ArrowFunctionExpression';
}

/**
 * Check whether or not a node is an AssignmentExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an AssignmentExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isAssignmentExpression(node) {
  return node.type === 'AssignmentExpression';
}

/**
 * Check whether or not a node is an BinaryExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an BinaryExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isBinaryExpression(node) {
  return node !== undefined && node.type === 'BinaryExpression';
}

/**
 * Check whether or not a node is an CallExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an CallExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
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
  if (!isCallExpression(node)) {
    return false;
  }
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
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isClassDeclaration(node) {
  return node !== undefined && node.type === 'ClassDeclaration';
}

/**
 * Check whether or not a node is a ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8).
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a ClassProperty or PropertyDefinition.
 */
function isClassPropertyOrPropertyDefinition(node) {
  return (
    node !== undefined && (node.type === 'ClassProperty' || node.type === 'PropertyDefinition')
  );
}

function isCommaToken(token) {
  return token.type === 'Punctuator' && token.value === ',';
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
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isConditionalExpression(node) {
  return node !== undefined && node.type === 'ConditionalExpression';
}

/**
 * Check whether or not a node is a Decorator.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a Decorator.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isDecorator(node) {
  return node !== undefined && node.type === 'Decorator';
}

/**
 * Check whether or not a node is an ExpressionStatement.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ExpressionStatement.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isExpressionStatement(node) {
  return node !== undefined && node.type === 'ExpressionStatement';
}

/**
 * Check whether or not a node is a FunctionDeclaration
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a FunctionDeclaration
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isFunctionDeclaration(node) {
  return node !== undefined && node.type === 'FunctionDeclaration';
}

/**
 * Check whether or not a node is an FunctionExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an FunctionExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isFunctionExpression(node) {
  return node !== undefined && node.type === 'FunctionExpression';
}

/**
 * Check whether or not a node is an Identifier.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Identifier.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isIdentifier(node) {
  return node !== undefined && node.type === 'Identifier';
}

/**
 * Check whether or not a node is an ImportDeclaration.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ImportDeclaration.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isImportDeclaration(node) {
  return node !== undefined && node.type === 'ImportDeclaration';
}

/**
 * Check whether or not a node is an ImportDefaultSpecifier.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ImportDefaultSpecifier.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isImportDefaultSpecifier(node) {
  return node !== undefined && node.type === 'ImportDefaultSpecifier';
}

/**
 * Check whether or not a node is an Literal.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Literal.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isLiteral(node) {
  return node !== undefined && node.type === 'Literal';
}

/**
 * Check whether or not a node is an LogicalExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an LogicalExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isLogicalExpression(node) {
  return node !== undefined && node.type === 'LogicalExpression';
}

/**
 * Check whether or not a node is an MemberExpression.
 *
 * @param {Object} node The node to check.
 * @return {boolean} Whether or not the node is an MemberExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isMemberExpression(node) {
  return node !== undefined && node.type === 'MemberExpression';
}

/**
 * Check whether or not a node is a MethodDefinition.
 *
 * @param {Object} node The node to check.
 * @return {boolean} Whether or not the node is a MethodDefinition.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isMethodDefinition(node) {
  return node !== undefined && node.type === 'MethodDefinition';
}

/**
 * Check whether or not a node is an NewExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an NewExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isNewExpression(node) {
  return node !== undefined && node.type === 'NewExpression';
}

/**
 * Check whether or not a node is an ObjectExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ObjectExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isObjectExpression(node) {
  return node !== undefined && node.type === 'ObjectExpression';
}

/**
 * Check whether or not a node is an ObjectPattern.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ObjectPattern.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isObjectPattern(node) {
  return node !== undefined && node.type === 'ObjectPattern';
}

/**
 * Check whether or not a node is an OptionalCallExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an OptionalCallExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isOptionalCallExpression(node) {
  return node.type === 'OptionalCallExpression';
}

/**
 * Check whether or not a node is an OptionalMemberExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an OptionalMemberExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isOptionalMemberExpression(node) {
  return node.type === 'OptionalMemberExpression';
}

/**
 * Check whether or not a node is an Property.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Property.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isProperty(node) {
  return node !== undefined && node.type === 'Property';
}

/**
 * Check whether or not a node is a ReturnStatement
 *
 * @param {Object} node The node to check.
 * @return {Boolean} Whether or not the node is a ReturnStatement.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isReturnStatement(node) {
  return node !== undefined && node.type && node.type === 'ReturnStatement';
}

/**
 * Check whether or not a node is a SpreadElement
 *
 * @param {Object} node The node to check.
 * @return {Boolean} Whether or not the node is a SpreadElement.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isSpreadElement(node) {
  return node !== undefined && node.type === 'SpreadElement';
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
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isTaggedTemplateExpression(node) {
  return node !== undefined && node.type === 'TaggedTemplateExpression';
}

/**
 * Check whether or not a node is a TemplateLiteral.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a TemplateLiteral.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isTemplateLiteral(node) {
  return node !== undefined && node.type === 'TemplateLiteral';
}

/**
 * Check whether or not a node is an ThisExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an ThisExpression.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isThisExpression(node) {
  return node !== undefined && node.type === 'ThisExpression';
}

/**
 * Check whether or not a node is an UnaryExpression.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is an Literal.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isUnaryExpression(node) {
  return node !== undefined && node.type === 'UnaryExpression';
}

/**
 * Check whether or not a node is a VariableDeclarator.
 *
 * @param {Object} node The node to check.
 * @returns {boolean} Whether or not the node is a VariableDeclarator.
 * @deprecated trivial helpers are deprecated in favor of inlining the type check
 */
function isVariableDeclarator(node) {
  return node !== undefined && node.type === 'VariableDeclarator';
}
