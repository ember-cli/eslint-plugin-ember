'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const propertyGetterUtils = require('../utils/property-getter');
const assert = require('assert');
const scopeReferencesThis = require('../utils/scope-references-this');
const { getImportIdentifier } = require('../utils/import');

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
const ERROR_MESSAGE_FILTER_BY = makeErrorMessage('filterBy');
const ERROR_MESSAGE_MAP_BY = makeErrorMessage('mapBy');

/**
 * Checks if a CallExpression node looks like `this.x.someFunction()` or `this.x.y.someFunction()`.
 *
 * @param {Node} node The CallExpression node to check.
 * @param {String} functionName The name of the function call to check for.
 * @returns {boolean} Whether the node looks like `this.x.someFunction()` or `this.x.y.someFunction()`.
 */
function isThisPropertyFunctionCall(node, functionName) {
  if (
    node.type !== 'CallExpression' ||
    node.callee.type !== 'MemberExpression' ||
    node.callee.property.type !== 'Identifier' ||
    node.callee.property.name !== functionName
  ) {
    return false;
  }

  let current = node.callee;
  while (current !== null) {
    if (
      types.isMemberExpression(current) &&
      !current.computed &&
      types.isIdentifier(current.property)
    ) {
      current = current.object;
    } else if (types.isThisExpression(current)) {
      return true;
    } else {
      break;
    }
  }

  return false;
}

/**
 * Checks if a LogicalExpression looks like `this.x && this.y && this.z`
 * containing only simple `this.x` MemberExpression or `this.get('x')` CallExpression nodes.
 *
 * @param {Node} node The LogicalExpression node to check.
 * @returns {boolean} Whether the node looks like `this.x && this.y && this.z` or `this.get('x') && this.get('y') && this.get('z')`.
 */
function isSimpleThisExpressionsInsideLogicalExpression(node, operator) {
  assert(types.isLogicalExpression(node), 'Must call function on LogicalExpression');

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

function makeFix(nodeToReplace, macro, macroArgs) {
  const isDecoratorUsage = types.isMethodDefinition(nodeToReplace);
  const prefix = isDecoratorUsage ? '@' : ''; // Decorator usage has @ symbol prefixing computed()
  const suffix = isDecoratorUsage ? ` ${nodeToReplace.key.name}` : ''; // Decorator usage has property name as suffix.
  return `${prefix}computed.${macro}(${macroArgs})${suffix}`;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require using computed property macros when possible',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-computed-macros.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          includeNativeGetters: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
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
  ERROR_MESSAGE_FILTER_BY,
  ERROR_MESSAGE_MAP_BY,

  create(context) {
    function reportSingleArg(nodeComputedProperty, nodeWithThisExpression, macro) {
      context.report({
        node: nodeComputedProperty,
        message: makeErrorMessage(macro),
        fix(fixer) {
          const text = propertyGetterUtils.nodeToDependentKey(nodeWithThisExpression, context);
          return fixer.replaceText(
            nodeComputedProperty,
            makeFix(nodeComputedProperty, macro, `'${text}'`)
          );
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
            makeFix(nodeComputedProperty, macro, `'${textLeft}', ${textRight}`)
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
            .map((node) => propertyGetterUtils.nodeToDependentKey(node, context))
            .join("', '");
          return fixer.replaceText(
            nodeComputedProperty,
            makeFix(nodeComputedProperty, macro, `'${text}'`)
          );
        },
      });
    }

    function reportFunctionCall(nodeComputedProperty, nodeCallExpression, macro) {
      context.report({
        node: nodeComputedProperty,
        message: makeErrorMessage(macro),
        fix(fixer) {
          const sourceCode = context.getSourceCode();
          const arg1 = propertyGetterUtils.nodeToDependentKey(
            nodeCallExpression.callee.object,
            context
          );
          const restOfArgs = nodeCallExpression.arguments.map((arg) => sourceCode.getText(arg));
          return fixer.replaceText(
            nodeComputedProperty,
            makeFix(nodeComputedProperty, macro, `'${arg1}', ${restOfArgs.join(', ')}`)
          );
        },
      });
    }

    let importedEmberName;
    let importedComputedName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
        }
      },

      // eslint-disable-next-line complexity
      CallExpression(node) {
        if (!emberUtils.isComputedProp(node, importedEmberName, importedComputedName)) {
          return;
        }

        // Options:
        const includeNativeGetters = context.options[0] && context.options[0].includeNativeGetters;

        let getterBody;
        let nodeToReport;
        if (
          node.arguments.length > 0 &&
          types.isFunctionExpression(node.arguments[node.arguments.length - 1])
        ) {
          // Example: computed('dependentKey', function() { return this.x })
          getterBody = node.arguments[node.arguments.length - 1].body.body;
          nodeToReport = node;
        } else if (
          includeNativeGetters &&
          types.isDecorator(node.parent) &&
          types.isMethodDefinition(node.parent.parent) &&
          node.parent.parent.decorators.length === 1 &&
          node.parent.parent.kind === 'get' &&
          types.isFunctionExpression(node.parent.parent.value)
        ) {
          // Example: @computed() get someProp() { return this.x; }
          getterBody = node.parent.parent.value.body.body;
          nodeToReport = node.parent.parent;
        } else {
          return;
        }

        if (getterBody.length !== 1) {
          return;
        }

        if (!types.isReturnStatement(getterBody[0])) {
          return;
        }

        const statement = getterBody[0].argument;
        if (!statement) {
          return;
        }

        if (
          types.isUnaryExpression(statement) &&
          statement.operator === '!' &&
          propertyGetterUtils.isSimpleThisExpression(statement.argument)
        ) {
          reportSingleArg(nodeToReport, statement.argument, 'not');
        } else if (types.isLogicalExpression(statement)) {
          if (isSimpleThisExpressionsInsideLogicalExpression(statement, '&&')) {
            reportLogicalExpression(nodeToReport, statement, 'and');
          } else if (isSimpleThisExpressionsInsideLogicalExpression(statement, '||')) {
            reportLogicalExpression(nodeToReport, statement, 'or');
          }
        } else if (
          types.isBinaryExpression(statement) &&
          types.isLiteral(statement.right) &&
          propertyGetterUtils.isSimpleThisExpression(statement.left)
        ) {
          switch (statement.operator) {
            case '===': {
              reportBinaryExpression(nodeToReport, statement, 'equal');

              break;
            }
            case '>': {
              reportBinaryExpression(nodeToReport, statement, 'gt');

              break;
            }
            case '>=': {
              reportBinaryExpression(nodeToReport, statement, 'gte');

              break;
            }
            case '<': {
              reportBinaryExpression(nodeToReport, statement, 'lt');

              break;
            }
            case '<=': {
              reportBinaryExpression(nodeToReport, statement, 'lte');

              break;
            }
            // No default
          }
        } else if (propertyGetterUtils.isSimpleThisExpression(statement)) {
          reportSingleArg(nodeToReport, statement, 'reads');
        } else if (
          isThisPropertyFunctionCall(statement, 'filterBy') &&
          !statement.arguments.some(scopeReferencesThis)
        ) {
          reportFunctionCall(nodeToReport, statement, 'filterBy');
        } else if (
          isThisPropertyFunctionCall(statement, 'mapBy') &&
          !statement.arguments.some(scopeReferencesThis)
        ) {
          reportFunctionCall(nodeToReport, statement, 'mapBy');
        }
      },
    };
  },
};
