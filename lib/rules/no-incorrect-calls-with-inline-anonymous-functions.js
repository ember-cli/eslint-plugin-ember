'use strict';

const types = require('../utils/types');

const ERROR_MESSAGE =
  'Do not use anonymous functions as arguments to `debounce`, `once`, and `scheduleOnce`.';

function isMemberExpressionOnRun(node) {
  return types.isMemberExpression(node.callee) && node.callee.object.name === 'run';
}

const functionRules = [
  { importPath: '@ember/runloop', importName: 'debounce' },
  { importPath: '@ember/runloop', importName: 'once' },
  { importPath: '@ember/runloop', importName: 'scheduleOnce' },
];

const allDedupingRunMethodNames = new Set(functionRules.map((rule) => rule.importName));

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,

  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow inline anonymous functions as arguments to `debounce`, `once`, and `scheduleOnce`',
      category: 'Miscellaneous',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-incorrect-calls-with-inline-anonymous-functions.md',
    },
    schema: [],
  },

  create(context) {
    function checkArgumentsForInlineFunction(node) {
      for (const [index, argument] of node.arguments.entries()) {
        if (types.isAnyFunctionExpression(argument)) {
          context.report({ node: node.arguments[index], message: ERROR_MESSAGE });
        }
      }
    }
    function checkFunctionRule(functionRule, node) {
      if (functionRule.importName === node.callee.name) {
        checkArgumentsForInlineFunction(node);
      }
    }

    let importedRun = false;
    const inactiveFunctionRules = new Set(functionRules);
    const activeFunctionRules = new Set();

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const namedImports = new Set(
          node.specifiers
            .filter((specifier) => specifier.imported)
            .map((specifier) => {
              return specifier.imported.name;
            })
        );

        for (const functionRule of inactiveFunctionRules) {
          if (functionRule.importPath === importPath && namedImports.has(functionRule.importName)) {
            inactiveFunctionRules.delete(functionRule);
            activeFunctionRules.add(functionRule);
          }
        }

        if (node.source.value === '@ember/runloop' && namedImports.has('run')) {
          importedRun = true;
        }
      },
      CallExpression(node) {
        for (const functionRule of activeFunctionRules) {
          checkFunctionRule(functionRule, node);
        }

        if (importedRun && isMemberExpressionOnRun(node)) {
          if (allDedupingRunMethodNames.has(node.callee.property.name)) {
            checkArgumentsForInlineFunction(node);
          }
        }
      },
    };
  },
};
