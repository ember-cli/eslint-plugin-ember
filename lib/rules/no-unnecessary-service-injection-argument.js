'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  "Don't specify injected service name as an argument when it matches the property name.";

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary argument when injecting services',
      category: 'Services',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unnecessary-service-injection-argument.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      Property(node) {
        if (
          !emberUtils.isInjectedServiceProp(node) ||
          node.value.arguments.length !== 1 ||
          !types.isStringLiteral(node.value.arguments[0])
        ) {
          return;
        }

        const keyName = node.key.name;
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

      ClassProperty(node) {
        if (
          !emberUtils.isInjectedServiceProp(node) ||
          node.decorators.length !== 1 ||
          !types.isCallExpression(node.decorators[0].expression) ||
          node.decorators[0].expression.arguments.length !== 1 ||
          !types.isStringLiteral(node.decorators[0].expression.arguments[0])
        ) {
          return;
        }

        const keyName = node.key.name;
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
      },
    };
  },
};
