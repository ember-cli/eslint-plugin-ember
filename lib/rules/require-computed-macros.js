'use strict';

const utils = require('../utils/utils');
const emberUtils = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function makeErrorMessage(macro) {
  return `Use the \`${macro}\` computed property macro.`;
}

const ERROR_MESSAGE_READS = makeErrorMessage('reads');
const ERROR_MESSAGE_AND = makeErrorMessage('and');
const ERROR_MESSAGE_OR = makeErrorMessage('or');
const ERROR_MESSAGE_GT = makeErrorMessage('gt');
const ERROR_MESSAGE_GTE = makeErrorMessage('gte');
const ERROR_MESSAGE_LT = makeErrorMessage('lt');
const ERROR_MESSAGE_LTE = makeErrorMessage('lte');
const ERROR_MESSAGE_NOT = makeErrorMessage('not');
const ERROR_MESSAGE_EQUAL = makeErrorMessage('equal');

/**
 * Checks if a MemberExpression node looks like `this.x` or `this.x.y`.
 *
 * @param {Node} node The MemberExpression node to check.
 * @returns {boolean} Whether the node looks like `this.x` or `this.x.y`.
 */
function isSimpleThisExpression(node) {
  if (!utils.isMemberExpression(node)) {
    return false;
  }

  let current = node;
  while (current !== null) {
    if (utils.isMemberExpression(current)) {
      if (!utils.isIdentifier(current.property)) {
        return false;
      }
      current = current.object;
    } else if (utils.isThisExpression(current)) {
      return true;
    } else {
      return false;
    }
  }

  return false;
}

/**
 * Checks if a LogicalExpression looks like `this.x && this.y && this.z`
 * containing only simple `this.x` MemberExpression nodes.
 *
 * @param {Node} node The LogicalExpression node to check.
 * @returns {boolean} Whether the node looks like `this.x && this.y && this.z`.
 */
function isSimpleThisExpressionsInsideLogicalExpression(node, operator) {
  if (!utils.isLogicalExpression(node)) {
    return false;
  }

  let current = node;
  while (current !== null) {
    if (utils.isLogicalExpression(current)) {
      if (!isSimpleThisExpression(current.right)) {
        return false;
      }
      if (current.operator !== operator) {
        return false;
      }
      current = current.left;
    } else if (isSimpleThisExpression(current)) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

/**
 * Converts a simple LogicalExpression into an array of the MemberExpression nodes in it.
 *
 * Example Input:   A LogicalExpression node with this source: `this.x && this.y.z && this.w`
 * Example Output:  An array of these MemberExpression nodes: [this.x, this.y.z, this.w]
 *
 * @param {Node} node The LogicalExpression node containing nodes that look like `this.x`.
 * @returns {Node[]} An array of MemberExpression nodes contained in the LogicalExpression.
 */
function getThisExpressions(nodeLogicalExpression) {
  const arrayOfThisExpressions = [];
  let current = nodeLogicalExpression;
  while (current !== null) {
    if (utils.isLogicalExpression(current)) {
      arrayOfThisExpressions.push(current.right);
      current = current.left;
    } else {
      arrayOfThisExpressions.push(current);
      break;
    }
  }
  return arrayOfThisExpressions.reverse();
}

module.exports = {
  meta: {
    docs: {
      description: 'Requires using computed property macros when possible',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
  },

  ERROR_MESSAGE_READS,
  ERROR_MESSAGE_AND,
  ERROR_MESSAGE_OR,
  ERROR_MESSAGE_GT,
  ERROR_MESSAGE_GTE,
  ERROR_MESSAGE_LT,
  ERROR_MESSAGE_LTE,
  ERROR_MESSAGE_NOT,
  ERROR_MESSAGE_EQUAL,

  create(context) {
    /**
     * Converts a Node containing a ThisExpression to its dependent key.
     *
     * Example Input:   A Node with this source code: `this.x.y`
     * Example Output:  'x.y'
     *
     * @param {Node} node a MemberExpression node that looks like `this.x` or `this.x.y`.
     * @returns {String} The dependent key of the input node (without `this.`).
     */
    function nodeToDependentKey(nodeWithThisExpression) {
      const sourceCode = context.getSourceCode();
      return sourceCode.getText(nodeWithThisExpression).replace(/^this\./, '');
    }

    function reportSingleArg(nodeComputedProperty, nodeWithThisExpression, macro) {
      context.report({
        node: nodeComputedProperty,
        message: makeErrorMessage(macro),
        fix(fixer) {
          const text = nodeToDependentKey(nodeWithThisExpression);
          return fixer.replaceText(nodeComputedProperty, `computed.${macro}('${text}')`);
        },
      });
    }

    function reportBinaryExpression(nodeComputedProperty, nodeBinaryExpression, macro) {
      context.report({
        node: nodeComputedProperty,
        message: makeErrorMessage(macro),
        fix(fixer) {
          const sourceCode = context.getSourceCode();
          const textLeft = nodeToDependentKey(nodeBinaryExpression.left);
          const textRight = sourceCode.getText(nodeBinaryExpression.right);
          return fixer.replaceText(
            nodeComputedProperty,
            `computed.${macro}('${textLeft}', ${textRight})`
          );
        },
      });
    }

    function reportLogicalExpression(nodeComputedProperty, nodeLogicalExpression, macro) {
      context.report({
        node: nodeComputedProperty,
        message: makeErrorMessage(macro),
        fix(fixer) {
          const text = getThisExpressions(nodeLogicalExpression)
            .map(nodeToDependentKey)
            .join("', '");
          return fixer.replaceText(nodeComputedProperty, `computed.${macro}('${text}')`);
        },
      });
    }

    return {
      CallExpression(node) {
        if (!emberUtils.isComputedProp(node)) {
          return;
        }

        if (node.arguments.length === 0) {
          return;
        }

        const lastArg = node.arguments[node.arguments.length - 1];
        if (!utils.isFunctionExpression(lastArg)) {
          return;
        }

        if (lastArg.body.body.length !== 1) {
          return;
        }

        if (!utils.isReturnStatement(lastArg.body.body[0])) {
          return;
        }

        const statement = lastArg.body.body[0].argument;

        if (
          utils.isUnaryExpression(statement) &&
          statement.operator === '!' &&
          isSimpleThisExpression(statement.argument)
        ) {
          reportSingleArg(node, statement.argument, 'not');
        } else if (utils.isLogicalExpression(statement)) {
          if (isSimpleThisExpressionsInsideLogicalExpression(statement, '&&')) {
            reportLogicalExpression(node, statement, 'and');
          } else if (isSimpleThisExpressionsInsideLogicalExpression(statement, '||')) {
            reportLogicalExpression(node, statement, 'or');
          }
        } else if (
          utils.isBinaryExpression(statement) &&
          utils.isLiteral(statement.right) &&
          isSimpleThisExpression(statement.left)
        ) {
          if (statement.operator === '===') {
            reportBinaryExpression(node, statement, 'equal');
          } else if (statement.operator === '>') {
            reportBinaryExpression(node, statement, 'gt');
          } else if (statement.operator === '>=') {
            reportBinaryExpression(node, statement, 'gte');
          } else if (statement.operator === '<') {
            reportBinaryExpression(node, statement, 'lt');
          } else if (statement.operator === '<=') {
            reportBinaryExpression(node, statement, 'lte');
          }
        } else if (isSimpleThisExpression(statement)) {
          reportSingleArg(node, statement, 'reads');
        }
      },
    };
  },
};
