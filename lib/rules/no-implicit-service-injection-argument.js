'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't omit the argument for the injected service name.";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow omitting the injected service name argument',
      category: 'Services',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-implicit-service-injection-argument.md',
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
      // Handle native classes.

      if (
        !emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName) ||
        node.decorators.length !== 1
      ) {
        return;
      }

      if (
        types.isCallExpression(node.decorators[0].expression) &&
        node.decorators[0].expression.arguments.length > 0
      ) {
        // Already has the service name argument.
        return;
      }

      context.report({
        node: node.decorators[0].expression,
        message: ERROR_MESSAGE,
        fix(fixer) {
          const sourceCode = context.getSourceCode();

          // Ideally, we want to match the service's filename, and kebab-case filenames are most common.
          const serviceName = emberUtils.convertServiceNameToKebabCase(
            node.key.name || node.key.value
          );

          return node.decorators[0].expression.type === 'CallExpression'
            ? // Add after parenthesis.
              fixer.insertTextAfter(
                sourceCode.getTokenAfter(node.decorators[0].expression.callee),
                `'${serviceName}'`
              )
            : // No parenthesis yet so we need to add them.
              fixer.insertTextAfter(node.decorators[0].expression, `('${serviceName}')`);
        },
      });
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
        // Classic classes.

        if (
          !emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName) ||
          node.value.arguments.length > 0
        ) {
          // Already has the service name argument.
          return;
        }

        if (node.value.arguments.length === 0) {
          context.report({
            node: node.value,
            message: ERROR_MESSAGE,
            fix(fixer) {
              const sourceCode = context.getSourceCode();

              // Ideally, we want to match the service's filename, and kebab-case filenames are most common.
              const serviceName = emberUtils.convertServiceNameToKebabCase(
                node.key.name || node.key.value
              );

              return fixer.insertTextAfter(
                sourceCode.getTokenAfter(node.value.callee),
                `'${serviceName}'`
              );
            },
          });
        }
      },
      ClassProperty: visitClassPropertyOrPropertyDefinition,
      PropertyDefinition: visitClassPropertyOrPropertyDefinition,
    };
  },
};
