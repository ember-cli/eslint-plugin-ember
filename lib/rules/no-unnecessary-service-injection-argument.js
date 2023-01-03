'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  "Don't specify injected service name as an argument when it matches the property name.";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary argument when injecting services',
      category: 'Services',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unnecessary-service-injection-argument.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let importedInjectName;
    let importedEmberName;

    // Handle either ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8).
    function visitClassPropertyOrPropertyDefinition(node) {
      if (
        !emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName) ||
        node.decorators.length !== 1 ||
        !types.isCallExpression(node.decorators[0].expression) ||
        node.decorators[0].expression.arguments.length !== 1 ||
        !types.isStringLiteral(node.decorators[0].expression.arguments[0])
      ) {
        return;
      }

      const keyName = node.key.name || node.key.value;
      const firstArg = node.decorators[0].expression.arguments[0];
      const firstArgValue = firstArg.value;
      if (keyName === firstArgValue) {
        context.report({
          node: firstArg,
          message: ERROR_MESSAGE,
          fix(fixer) {
            return fixer.remove(firstArg);
          },
        });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/service') {
          importedInjectName =
            importedInjectName ||
            getImportIdentifier(node, '@ember/service', 'inject') ||
            getImportIdentifier(node, '@ember/service', 'service');
        }
      },
      Property(node) {
        if (
          !emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName) ||
          node.value.arguments.length !== 1 ||
          !types.isStringLiteral(node.value.arguments[0])
        ) {
          return;
        }

        const keyName = node.key.name || node.key.value;
        const firstArg = node.value.arguments[0];
        const firstArgValue = firstArg.value;
        if (keyName === firstArgValue) {
          context.report({
            node: firstArg,
            message: ERROR_MESSAGE,
            fix(fixer) {
              return fixer.remove(firstArg);
            },
          });
        }
      },

      ClassProperty: visitClassPropertyOrPropertyDefinition,
      PropertyDefinition: visitClassPropertyOrPropertyDefinition,
    };
  },
};
