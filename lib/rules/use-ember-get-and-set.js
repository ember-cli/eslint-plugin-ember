'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');
const types = require('../utils/types');

const collectObjectPatternBindings = utils.collectObjectPatternBindings;
const isIdentifier = types.isIdentifier;
const isThisExpression = types.isThisExpression;

//------------------------------------------------------------------------------
// General - use get and set
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `Ember.get` and `Ember.set`',
      category: 'Ember Object',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/use-ember-get-and-set.md',
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

    const testMethodsToSkip = new Set(['get', 'set']);

    // Skip mirage directory
    if (ember.isMirageDirectory(filename)) {
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
          for (const methodName of avoidedMethods) {
            const destructuredAssignment = collectObjectPatternBindings(node, {
              [emberImportAliasName]: [methodName],
            }).pop();
            if (destructuredAssignment) {
              localModulesPresent[methodName] = destructuredAssignment;
            }
          }
        }
      },

      CallExpression(node) {
        const callee = node.callee;
        const method = callee.property;

        // Skip this.get() and this.set() in tests/
        if (
          ember.isTestFile(filename) &&
          isThisExpression(callee.object) &&
          isIdentifier(method) &&
          testMethodsToSkip.has(method.name)
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
