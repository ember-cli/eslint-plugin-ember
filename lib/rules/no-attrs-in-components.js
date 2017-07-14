'use strict';

const utils = require('../utils/utils');

const MESSAGE = 'Do not use this.attrs';

//------------------------------------------------------------------------------
// General rule - Don't use this.attrs
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of this.attrs in components',
      category: 'General',
      recommended: true
    },
    fixable: null,
  },

  create(context) {
    return {
      MemberExpression(node) {
        if (utils.isThisAttrsExpression(node)) {
          context.report(node.property, MESSAGE);
        }
      }
    };
  }
};
