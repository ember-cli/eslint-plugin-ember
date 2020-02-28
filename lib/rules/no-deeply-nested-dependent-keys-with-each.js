'use strict';

const emberUtils = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  'Dependent keys containing `@each` only work one level deep. You cannot use nested forms like: `todos.@each.owner.name`. Please create an intermediary computed property instead.';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of deeply-nested computed property dependent keys with `@each`',
      category: 'Possible Errors',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-deeply-nested-dependent-keys-with-each.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (
          emberUtils.isComputedProp(node) &&
          (!node.callee.property || node.callee.property.name === 'computed')
        ) {
          emberUtils.parseDependentKeys(node).forEach(key => {
            const parts = key.split('.');
            const indexOfAtEach = parts.indexOf('@each');
            if (indexOfAtEach < 0) {
              return;
            }
            if (parts.length > indexOfAtEach + 2) {
              context.report({
                node,
                message: ERROR_MESSAGE,
              });
            }
          });
        }
      },
    };
  },
};
