'use strict';

const { isIdentifier } = require('../utils/utils');

//------------------------------------------------------------------------------
// General - use get and set
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces usage of Ember.get and Ember.set',
      category: 'General',
      recommended: true
    },
    fixable: 'code',
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const message = 'Use get/set';

    function report(node) {
      context.report({
        node: node.callee.property,
        message,
        fix(fixer) {
          // this.set('foo', 3);
          // └┬─┘ └┬┘ └───┬──┘
          //  │    │      └─────── args
          //  │    └────────────── method
          //  └─────────────────── subject

          const subject = sourceCode.getText(node.callee.object);
          const method = sourceCode.getText(node.callee.property);
          const args = node.arguments.map(a => sourceCode.getText(a)).join(', ');

          const fixedSource = `${method}(${subject}, ${args})`;

          return fixer.replaceText(node, fixedSource);
        }
      });
    }

    const avoidedMethods = [
      'get',
      'set',
      'getProperties',
      'setProperties',
      'getWithDefault',
    ];

    return {
      CallExpression(node) {
        const method = node.callee.property;

        if (isIdentifier(method) && avoidedMethods.indexOf(method.name) > -1) {
          report(node);
        }
      }
    };
  }
};
