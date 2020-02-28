'use strict';

const types = require('../utils/types');

const MESSAGE = 'Do not use this.attrs';

//------------------------------------------------------------------------------
// General rule - Don't use this.attrs
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of `this.attrs` in components',
      category: 'Possible Errors',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-attrs-in-components.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      MemberExpression(node) {
        if (isThisAttrsExpression(node)) {
          context.report(node.property, MESSAGE);
        }
      },
    };
  },
};

function isThisAttrsExpression(node) {
  return types.isThisExpression(node.object) && node.property.name === 'attrs';
}
