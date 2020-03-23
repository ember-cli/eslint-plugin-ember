'use strict';

const path = require('path');
const ember = require('../utils/ember');
const utils = require('../utils/utils');
const types = require('../utils/types');

const collectObjectPatternBindings = utils.collectObjectPatternBindings;
const isIdentifier = types.isIdentifier;
const isThisExpression = types.isThisExpression;

//------------------------------------------------------------------------------
// General - use get and set
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `Ember.get` and `Ember.set`',
      category: 'Best Practices',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/use-ember-get-and-set.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreThisExpressions: {
            type: 'boolean',
            default: false,
          },
          ignoreNonThisExpressions: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    let emberImportAliasName;
    // Populated during VariableDeclarator traversal
    const localModulesPresent = {};
    const sourceCode = context.getSourceCode();
    const filename = context.getFilename();
    const options = context.options[0] || {};
    const message = 'Use get/set';

    function isFileInDirectory(dirname) {
      const pathParts = filename.split(path.sep);
      return pathParts.includes(dirname);
    }

    function report(node) {
      context.report({
        node: node.callee.property,
        message,
        fix(fixer) {
          if (!emberImportAliasName) {
            return null;
          }
          // this.set('foo', 3);
          // └┬─┘ └┬┘ └───┬──┘
          //  │    │      └─────── args
          //  │    └────────────── method
          //  └─────────────────── subject

          const subject = sourceCode.getText(node.callee.object);
          const method = sourceCode.getText(node.callee.property);
          const args = node.arguments.map((a) => sourceCode.getText(a)).join(', ');

          const localModule = localModulesPresent[method];
          const replacementMethod = localModule || `${emberImportAliasName}.${method}`;

          const fixedSource = `${replacementMethod}(${subject}, ${args})`;

          return fixer.replaceText(node, fixedSource);
        },
      });
    }

    const avoidedMethods = ['get', 'set', 'getProperties', 'setProperties', 'getWithDefault'];

    const testMethodsToSkip = ['get', 'set'];

    const directoriesToSkipCompletely = ['mirage'];

    if (directoriesToSkipCompletely.some((dir) => isFileInDirectory(dir))) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        emberImportAliasName = ember.getEmberImportAliasName(node);
      },

      VariableDeclarator(node) {
        const isEmberImported = Boolean(emberImportAliasName);
        const isModuleScope = context.getScope().type === 'module';
        if (isEmberImported && isModuleScope) {
          // Populate localModulesPresent as a mapping of (avoided method -> local module alias)
          avoidedMethods.forEach((methodName) => {
            const destructuredAssignment = collectObjectPatternBindings(node, {
              [emberImportAliasName]: [methodName],
            }).pop();
            if (destructuredAssignment) {
              localModulesPresent[methodName] = destructuredAssignment;
            }
          });
        }
      },

      CallExpression(node) {
        const callee = node.callee;
        const method = callee.property;

        // Skip this.get() and this.set() in tests/
        if (
          isFileInDirectory('tests') &&
          isThisExpression(callee.object) &&
          isIdentifier(method) &&
          testMethodsToSkip.includes(method.name)
        ) {
          return;
        }

        // Skip calls made on this
        if (options.ignoreThisExpressions && isThisExpression(callee.object)) {
          return;
        }

        // Skip calls made on non this expression
        if (options.ignoreNonThisExpressions && !isThisExpression(callee.object)) {
          return;
        }

        // Skip calls made on Ember methods
        if (isIdentifier(callee.object) && callee.object.name === emberImportAliasName) {
          return;
        }

        if (isIdentifier(method) && avoidedMethods.includes(method.name)) {
          report(node);
        }
      },
    };
  },
};
