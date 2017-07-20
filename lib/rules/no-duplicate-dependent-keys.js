'use strict';

const utils = require('../utils/utils');

const MESSAGE = 'Dependent keys should not be repeated';
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow repeating dependent keys',
      category: 'General',
      recommended: true
    },
    fixable: null,
    message: MESSAGE,
  },

  create(context) {
    return {
      CallExpression(node) {
        if (utils.hasDuplicateDependentKeys(node)) {
          context.report(node, MESSAGE);
        }
      }
    };
  }
};
