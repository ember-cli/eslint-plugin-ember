'use strict';

const emberUtils = require('../utils/ember');
const assert = require('assert');

/**
 * Check if an identifier is being imported from an ImportDeclaration node.
 *
 * Examples where the identifier name 'foo' is being imported from the ImportDeclaration node:
 * * import foo from 'bar';
 * * import { foo } from 'bar';
 * * import { something as foo } from 'bar';
 *
 * @param {node} importDeclaration - the ImportDeclaration node to check
 * @param {string} identifierName - the identifier name we are checking for
 */
function hasImportedIdentifier(importDeclaration, identifierName) {
  assert(
    importDeclaration.type === 'ImportDeclaration',
    'parameter should be an ImportDeclaration'
  );
  assert(typeof identifierName === 'string', 'parameter should be a string');
  return (
    importDeclaration.specifiers.find((specifier) => {
      return specifier.local.name === identifierName;
    }) !== undefined
  );
}

//-------------------------------------------------------------------------------------
// Rule Definition
//-------------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `@ember/test-helpers` methods over native window methods',
      category: 'Testing',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/prefer-ember-test-helpers.md',
    },
    schema: [],
  },

  create: (context) => {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    let hasDefinedBlurFunction = false;
    let hasDefinedFindFunction = false;
    let hasDefinedFocusFunction = false;

    const markMethodsAsPresent = (fnName) => {
      if (fnName === 'blur') {
        hasDefinedBlurFunction = true;
      } else if (fnName === 'find') {
        hasDefinedFindFunction = true;
      } else if (fnName === 'focus') {
        hasDefinedFocusFunction = true;
      }
    };

    const showErrorMessage = (node, methodName) => {
      context.report({
        data: { methodName },
        message: 'Import the `{{methodName}}()` method from @ember/test-helpers',
        node,
      });
    };

    return {
      ImportDeclaration(node) {
        if (hasImportedIdentifier(node, 'blur')) {
          hasDefinedBlurFunction = true;
        }

        if (hasImportedIdentifier(node, 'find')) {
          hasDefinedFindFunction = true;
        }

        if (hasImportedIdentifier(node, 'focus')) {
          hasDefinedFocusFunction = true;
        }
      },
      FunctionDeclaration(node) {
        const fnName = node.id.name;

        markMethodsAsPresent(fnName);
      },
      FunctionExpression(node) {
        const nodeParent = node.parent;

        if (nodeParent && nodeParent.type === 'VariableDeclarator') {
          const fnName = nodeParent.id.name;

          markMethodsAsPresent(fnName);
        }
      },
      ArrowFunctionExpression(node) {
        const nodeParent = node.parent;

        if (nodeParent && nodeParent.type === 'VariableDeclarator') {
          const fnName = nodeParent.id.name;

          markMethodsAsPresent(fnName);
        }
      },
      CallExpression(node) {
        if (node.callee.type !== 'Identifier') {
          return;
        }

        if (isGlobalFunctionCall(node.callee.name, 'blur', hasDefinedBlurFunction)) {
          showErrorMessage(node, 'blur');
        }

        if (isGlobalFunctionCall(node.callee.name, 'find', hasDefinedFindFunction)) {
          showErrorMessage(node, 'find');
        }

        if (isGlobalFunctionCall(node.callee.name, 'focus', hasDefinedFocusFunction)) {
          showErrorMessage(node, 'focus');
        }
      },
    };
  },
};

/**
 * Check to see if a function call is calling a specific global function.
 * (i.e. `blur` not imported nor defined, but `blur` function called)
 *
 * @param {string} currentFnName - the name of the current function call
 * @param {string} targetFnName - name of relevant function we're checking for
 * @param {boolean} hasDefinedTargetFunction - whether we have seen the target function defined or imported
 */
function isGlobalFunctionCall(currentFnName, targetFnName, hasDefinedTargetFunction) {
  assert(typeof currentFnName === 'string', 'parameter should be a string');
  assert(typeof targetFnName === 'string', 'parameter should be a string');
  assert(typeof hasDefinedTargetFunction === 'boolean', 'parameter should be a boolean');
  return currentFnName === targetFnName && !hasDefinedTargetFunction;
}
