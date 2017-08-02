'use strict';

const path = require('path');
const utils = require('../utils/utils');

const isIdentifier = utils.isIdentifier;
const isThisExpression = utils.isThisExpression;

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
    const filename = context.getFilename();
    const message = 'Use get/set';

    function isFileInDirectory(dirname) {
      const pathParts = filename.split(path.sep);
      return pathParts.indexOf(dirname) > -1;
    }

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

    const testMethodsToSkip = [
      'get',
      'set',
    ];

    const directoriesToSkipCompletely = [
      'mirage',
    ];

    if (directoriesToSkipCompletely.some(dir => isFileInDirectory(dir))) {
      return {};
    }

    return {
      CallExpression(node) {
        const callee = node.callee;
        const method = callee.property;

        // Skip this.get() and this.set() in tests/
        if (
          isFileInDirectory('tests') &&
          isThisExpression(callee.object) &&
          isIdentifier(method) && testMethodsToSkip.indexOf(method.name) > -1
        ) {
          return;
        }

        if (isIdentifier(method) && avoidedMethods.indexOf(method.name) > -1) {
          report(node);
        }
      }
    };
  }
};
