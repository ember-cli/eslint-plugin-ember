'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');

const ERROR_MESSAGE = 'Do not use `pauseTest()`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of `pauseTest` helper in tests.',
      category: 'Testing',
      recommended: false,
    },
    fixable: null,
  },

  ERROR_MESSAGE,

  create(context) {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          (types.isIdentifier(callee) && callee.name === 'pauseTest') ||
          (types.isThisExpression(callee.object) &&
            types.isIdentifier(callee.property) &&
            callee.property.name === 'pauseTest')
        ) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
