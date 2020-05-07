'use strict';

const emberUtils = require('../utils/ember');

const getImportName = (node, namedImportIdentifier) => {
  return node.specifiers
    .filter((specifier) => {
      return (
        (specifier.type === 'ImportSpecifier' &&
          specifier.imported.name === namedImportIdentifier) ||
        (!namedImportIdentifier && specifier.type === 'ImportDefaultSpecifier')
      );
    })
    .map((specifier) => specifier.local.name)
    .pop();
};

//-------------------------------------------------------------------------------------
// Rule Definition
//-------------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `@ember/test-helpers` methods over native window methods',
      category: 'Testing',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/prefer-ember-test-helpers.md',
    },
    schema: [],
  },

  create: (context) => {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    let seenBlurFunctionName = undefined;
    let seenFindFunctionName = undefined;
    let seenFocusFunctionName = undefined;

    const markMethodsAsPresent = (fnName) => {
      if (fnName === 'blur') {
        seenBlurFunctionName = 'blur';
      } else if (fnName === 'find') {
        seenFindFunctionName = 'find';
      } else if (fnName === 'focus') {
        seenFocusFunctionName = 'focus';
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
        seenBlurFunctionName = getImportName(node, 'blur');
        seenFindFunctionName = getImportName(node, 'find');
        seenFocusFunctionName = getImportName(node, 'focus');
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
        if (isDisallowed('blur', seenBlurFunctionName, node.callee.name)) {
          showErrorMessage(node, 'blur');
        }

        if (isDisallowed('find', seenFindFunctionName, node.callee.name)) {
          showErrorMessage(node, 'find');
        }

        if (isDisallowed('focus', seenFocusFunctionName, node.callee.name)) {
          showErrorMessage(node, 'focus');
        }
      },
    };
  },
};

function isDisallowed(targetFunctionName, seenFunctionName, currentFunctionName) {
  // Examples of disallowed scenarios:
  // * `blur` not imported nor defined, but `blur` function called
  // * `blur` imported as `blur123`, but `blur` function called
  return (
    (!seenFunctionName && currentFunctionName === targetFunctionName) ||
    (seenFunctionName &&
      seenFunctionName !== targetFunctionName &&
      currentFunctionName === targetFunctionName)
  );
}
