'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

const ERROR_MESSAGE = 'Do not use volatile computed properties';

module.exports = {
  ERROR_MESSAGE,

  meta: {
    docs: {
      description: 'Disallows volatile computed properties',
      category: 'Best Practices',
      recommended: true,
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (
          types.isMemberExpression(node.callee) &&
          types.isCallExpression(node.callee.object) &&
          emberUtils.isComputedProp(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'volatile'
        ) {
          context.report(node.callee.property, ERROR_MESSAGE);
        }
      },
    };
  },
};
