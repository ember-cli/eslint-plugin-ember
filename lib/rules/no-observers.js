'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't use observers if possible";

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevents usage of observers',
      category: 'Best Practices',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-observers.md',
    },
    fixable: null, // or "code" or "whitespace"
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function(node) {
      context.report(node, ERROR_MESSAGE);
    };

    return {
      CallExpression(node) {
        if (ember.isModule(node, 'observer')) {
          report(node);
        }
      },

      Decorator(node) {
        if (ember.isObserverDecorator(node)) {
          report(node);
        }
      },
    };
  },
};
