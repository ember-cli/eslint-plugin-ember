'use strict';

const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  'This Ember debug function has its arguments passed in the wrong order. `String description` should come before `Boolean condition`.';

const DEBUG_FUNCTIONS = ['assert', 'deprecate', 'warn'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "disallow usages of Ember's `assert()` / `warn()` / `deprecate()` functions that have the arguments passed in the wrong order.",
      category: 'Miscellaneous',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-invalid-debug-function-arguments.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,
  DEBUG_FUNCTIONS,

  create(context) {
    let importedIdentifiers = [];

    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@ember/debug') {
          return;
        }

        // Gather the identifiers that these functions are imported under.
        importedIdentifiers = DEBUG_FUNCTIONS.map((fn) =>
          getImportIdentifier(node, '@ember/debug', fn)
        );
      },

      CallExpression(node) {
        if (isDebugFunctionWithReversedArgs(node, importedIdentifiers)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};

function isDebugFunctionWithReversedArgs(node, importedIdentifiers) {
  return (
    isDebugFunction(node, importedIdentifiers) &&
    node.arguments.length >= 2 &&
    !types.isString(node.arguments[0]) &&
    types.isString(node.arguments[1])
  );
}

function isDebugFunction(node, importedIdentifiers) {
  return getDebugFunction(node, importedIdentifiers) !== undefined;
}

function getDebugFunction(node, importedIdentifiers) {
  const isEmberDebugFunctionCall = DEBUG_FUNCTIONS.find(
    (debugFunction) =>
      types.isMemberExpression(node.callee) &&
      types.isIdentifier(node.callee.object) &&
      node.callee.object.name === 'Ember' &&
      types.isIdentifier(node.callee.property) &&
      node.callee.property.name === debugFunction
  );

  const isImportedDebugFunctionCall = importedIdentifiers.find(
    (debugFunction) => types.isIdentifier(node.callee) && node.callee.name === debugFunction
  );

  return isEmberDebugFunctionCall || isImportedDebugFunctionCall;
}
