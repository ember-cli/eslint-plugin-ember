'use strict';

const utils = require('../utils/utils');

const ERROR_MESSAGE = 'All `addEventListener` calls should have a corresponding `removeEventListener` to avoid leaking callbacks.';
//------------------------------------------------------------------------------
// Ember object rule - Avoid callback memory leaks
// Callback leaks are memory leaks that occur due to state being caught
// in a callback function that is never released from memory.
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Avoids callback memory leaks',
      category: 'Ember Object',
      url: 'https://github.com/ember-best-practices/memory-leak-examples/blob/master/exercises/exercise-2.md'
    },
    fixable: null, // or "code" or "whitespace"
    ERROR_MESSAGE,
  },


  create(context) {
    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    const addedListeners = [];
    const removedListeners = [];
    return {
      'Program:exit': function () {
        addedListeners.forEach((a) => {
          const idx = removedListeners.findIndex(r => r.el === a.el && r.event === a.event);

          if (idx < 0) {
            // No removeEventListener
            report(a.node);
          }
        });
      },

      CallExpression(node) {
        if (utils.getPropertyValue(node, 'callee.property.name') === 'addEventListener') {
          const listener = {
            el: node.callee.object.name,
            event: node.arguments[0].value,
            node
          };

          addedListeners.push(listener);
        }

        if (utils.getPropertyValue(node, 'callee.property.name') === 'removeEventListener') {
          const listener = {
            el: node.callee.object.name,
            event: node.arguments[0].value
          };

          removedListeners.push(listener);
        }
      }
    };
  },
};
