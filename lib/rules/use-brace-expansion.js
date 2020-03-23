'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Use brace expansion
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Use brace expansion';

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce usage of brace expansion in computed property dependent keys',
      category: 'Stylistic Issues',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/use-brace-expansion.md',
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

        const matchesBraces = (x) => Boolean(x.match(/[{}]/g)); // eslint-disable-line unicorn/consistent-function-scoping
        const hasBraces = (arr) => arr.some(matchesBraces);
        const beforeBraces = (arr) => arr.slice(0, arr.indexOf(arr.find(matchesBraces)));
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const arrayDeepEqual = (a, b) =>
          a.length === b.length && a.reduce((acc, e, i) => acc && e === b[i], true);

        const problem = node.arguments
          .filter(
            (arg) =>
              types.isLiteral(arg) && typeof arg.value === 'string' && arg.value.includes('.')
          )
          .map((e) => e.value.split('.'))
          .find(
            (prop, i, props) =>
              props.filter((e) => {
                const propHasBraces = hasBraces(prop);
                const eHasBraces = hasBraces(e);

                if (propHasBraces && eHasBraces) {
                  return arrayDeepEqual(beforeBraces(e), beforeBraces(prop));
                } else if (!propHasBraces && !eHasBraces) {
                  return prop[0] === e[0];
                }

                const withBraces = propHasBraces ? prop : e;
                const withoutBraces = propHasBraces ? e : prop;
                const shareable = beforeBraces(withBraces);
                return arrayDeepEqual(shareable, withoutBraces.slice(0, shareable.length));
              }).length > 1
          );

        if (problem) {
          context.report({
            node,
            message: ERROR_MESSAGE,
            loc: {
              // Only report the string arguments (dependent keys) of the computed property (not the entire function body).
              start: node.arguments[0].loc.start,
              end: node.arguments[node.arguments.length - 2].loc.end,
            },
          });
        }
      },
    };
  },
};
