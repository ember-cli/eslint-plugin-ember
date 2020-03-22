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
      category: 'Stylistic Issues',
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
          !types.isLiteral(node.value.arguments[0])
        ) {
          return;
        }

        const keyName = node.key.name;
        const firstArgValue = node.value.arguments[0].value;
        if (keyName === firstArgValue) {
          context.report({
            node: node.value.arguments[0],
            message: ERROR_MESSAGE,
            fix(fixer) {
              return fixer.remove(node.value.arguments[0]);
            },
          });
        }
      },
    };
  },
};
