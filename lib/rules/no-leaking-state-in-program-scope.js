'use strict';

const message = 'Use const on global scope';

module.exports = {
  meta: {
    docs: {
      description: 'Do not allow anything else than constants in global module namespace.',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null,
  },

  create(context) {
    const report = function(node) {
      context.report(node, message);
    };

    return {
      VariableDeclaration(node) {
        if (node.parent.type === 'Program' && node.kind !== 'const') {
          report(node, message);
        }
      },
    };
  },
};
