'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const propertyGetterUtils = require('../utils/property-getter');

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
 * Checks if a LogicalExpression looks like `this.x && this.y && this.z`
 * containing only simple `this.x` MemberExpression or `this.get('x')` CallExpression nodes.
 *
 * @param {Node} node The LogicalExpression node to check.
 * @returns {boolean} Whether the node looks like `this.x && this.y && this.z` or `this.get('x') && this.get('y') && this.get('z')`.
 */
function isSimpleThisExpressionsInsideLogicalExpression(node, operator) {
  if (!types.isLogicalExpression(node)) {
    return false;
  }

  let current = node;
  while (current !== null) {
    if (types.isLogicalExpression(current)) {
      if (!propertyGetterUtils.isSimpleThisExpression(current.right)) {
        return false;
      }
      if (current.operator !== operator) {
        return false;
      }
      current = current.left;
    } else if (propertyGetterUtils.isSimpleThisExpression(current)) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

/**
 * Converts a simple LogicalExpression into an array of the MemberExpression/CallExpression nodes in it.
 *
 * Example Input:   A LogicalExpression node with this source: `this.x && this.y.z && this.w`
 * Example Output:  An array of these MemberExpression nodes: [this.x, this.y.z, this.w]
 *
 * @param {Node} node The LogicalExpression node containing nodes that look like `this.x` or `this.get('x')`.
 * @returns {Node[]} An array of MemberExpression/CallExpression nodes contained in the LogicalExpression.
 */
function getThisExpressions(nodeLogicalExpression) {
  const arrayOfThisExpressions = [];
  let current = nodeLogicalExpression;
  while (current !== null) {
    if (types.isLogicalExpression(current)) {
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
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-computed-macros.md',
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
    function reportSingleArg(nodeComputedProperty, nodeWithThisExpression, macro) {
      context.report({
        node: nodeComputedProperty,
        message: makeErrorMessage(macro),
        fix(fixer) {
          const text = propertyGetterUtils.nodeToDependentKey(nodeWithThisExpression, context);
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
          const textLeft = propertyGetterUtils.nodeToDependentKey(
            nodeBinaryExpression.left,
            context
          );
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
            .map(node => propertyGetterUtils.nodeToDependentKey(node, context))
            .join("', '");
          return fixer.replaceText(nodeComputedProperty, `computed.${macro}('${text}')`);
        },
      });
    }

    return {
      // eslint-disable-next-line complexity
      CallExpression(node) {
        if (!emberUtils.isComputedProp(node)) {
          return;
        }

        if (node.arguments.length === 0) {
          return;
        }

        const lastArg = node.arguments[node.arguments.length - 1];
        if (!types.isFunctionExpression(lastArg)) {
          return;
        }

        if (lastArg.body.body.length !== 1) {
          return;
        }

        if (!types.isReturnStatement(lastArg.body.body[0])) {
          return;
        }

        const statement = lastArg.body.body[0].argument;
        if (!statement) {
          return;
        }

        if (
          types.isUnaryExpression(statement) &&
          statement.operator === '!' &&
          propertyGetterUtils.isSimpleThisExpression(statement.argument)
        ) {
          reportSingleArg(node, statement.argument, 'not');
        } else if (types.isLogicalExpression(statement)) {
          if (isSimpleThisExpressionsInsideLogicalExpression(statement, '&&')) {
            reportLogicalExpression(node, statement, 'and');
          } else if (isSimpleThisExpressionsInsideLogicalExpression(statement, '||')) {
            reportLogicalExpression(node, statement, 'or');
          }
        } else if (
          types.isBinaryExpression(statement) &&
          types.isLiteral(statement.right) &&
          propertyGetterUtils.isSimpleThisExpression(statement.left)
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
        } else if (propertyGetterUtils.isSimpleThisExpression(statement)) {
          reportSingleArg(node, statement, 'reads');
        }
      },
    };
  },
};
