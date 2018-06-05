'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't introduce side-effects in computed properties
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Warns about unexpected side effects in computed properties',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-side-effects.md'
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Don\'t introduce side-effects in computed properties';

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        const callee = node.callee;
        const isSet = (
          utils.isIdentifier(callee) &&
          callee.name === 'set'
        ) || (
          utils.isMemberExpression(callee) &&
          utils.isThisExpression(callee.object) &&
          utils.isIdentifier(callee.property) &&
          callee.property.name === 'set'
        );

        if (isSet) {
          const ancestors = context.getAncestors();
          if (ancestors.some(ember.isComputedProp)) {
            report(node);
          }
        }
      },
    };
  }
};
