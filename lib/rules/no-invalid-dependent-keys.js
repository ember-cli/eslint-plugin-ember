'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule -  Dependent keys used for computed properties have to be valid.
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Invalid dependent keys: unbalanced braces';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid dependent keys in computed properties',
      category: 'Possible Errors',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-invalid-dependent-keys.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (!ember.isComputedProp(node) || types.isMemberExpression(node.callee)) {
          return;
        }

        const argMap = node.arguments.filter(
          arg => types.isLiteral(arg) && typeof arg.value === 'string'
        );

        const problemNodes = argMap.filter(node => {
          const stringValue = node.value;
          const foundBraces = stringValue.match(/[{}]/g) || [];
          const openBraces = foundBraces.filter(c => c === '{').length;
          const closeBraces = foundBraces.filter(c => c === '}').length;
          return openBraces !== closeBraces;
        });

        problemNodes.forEach(problemNode => {
          context.report({
            node: problemNode,
            message: ERROR_MESSAGE,
          });
        });
      },
    };
  },
};
