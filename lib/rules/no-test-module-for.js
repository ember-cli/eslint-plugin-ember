'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

const ERROR_MESSAGE = 'moduleFor* apis are are not allowed. Use `module` instead of `moduleFor`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of moduleFor, moduleForComponent, etc',
      category: 'Testing',
      recommended: false,
    },
    fixable: null,
  },

  ERROR_MESSAGE,

  create(context) {
    const filename = context.getFilename();
    const isTestFile =
      emberUtils.isTestFile(filename) ||
      (filename.includes('tests') && filename.includes('helpers'));

    if (!isTestFile) {
      return {};
    }

    return {
      FunctionDeclaration(node) {
        const id = node.id;
        if (types.isIdentifier(id) && id.name.startsWith('moduleFor')) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
      CallExpression(node) {
        const callee = node.callee;
        if (types.isIdentifier(callee) && callee.name.startsWith('moduleFor')) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
