'use strict';

const emberUtils = require('../utils/ember');

const MESSAGE = 'Dependent keys should not be repeated';
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow repeating dependent keys',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: null,
    message: MESSAGE,
  },

  create(context) {
    return {
      CallExpression(node) {
        if (emberUtils.hasDuplicateDependentKeys(node)) {
          context.report(node, MESSAGE);
        }
      }
    };
  }
};
