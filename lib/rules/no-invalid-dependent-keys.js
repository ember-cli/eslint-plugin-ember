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
      description: 'require that dependent keys used for computed properties to be valid.',
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

        const argMap = node.arguments
          .filter(arg => types.isLiteral(arg) && typeof arg.value === 'string')
          .map(e => e.value);

        const problem = argMap.filter(prop => {
          const foundBraces = prop.match(/[{}]/g) || [];
          const openBraces = foundBraces.filter(c => c === '{').length;
          const closeBraces = foundBraces.filter(c => c === '}').length;
          return openBraces !== closeBraces;
        });
        if (problem && problem.length > 0) {
          problem.forEach(() => {
            context.report({
              node,
              message: ERROR_MESSAGE,
              loc: {
                // Only report the string arguments (dependent keys) of the computed property (not the entire function body).
                start: node.arguments[0].loc.start,
                end: node.arguments[node.arguments.length - 2].loc.end,
              },
            });
          });
        }
      },
    };
  },
};
