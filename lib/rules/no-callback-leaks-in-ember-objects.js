'use strict';

// const ember = require('../utils/ember');
const utils = require('../utils/utils');


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
      recommended: true,
      url: 'https://github.com/ember-best-practices/memory-leak-examples/blob/master/exercises/exercise-2.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [{
      type: 'array',
      items: { type: 'string' },
    }],
  },


  create(context) {
    const report = function (node) {
      const message = "Event listeners and interval timers must be unregistered or ensure that the context they're registered with is destroyed, when no longer needed.";
      context.report(node, message);
    };

    const addedListeners = [];
    const removedListeners = [];
    return {
      'ExportDefaultDeclaration:exit': function (node) {
        addedListeners.forEach((a) => {
          const idx = removedListeners.findIndex(r => r.el === a.el);

          if (idx < 0) {
            // No removeEventListener
            report(node);
          }
        });
      },

      CallExpression(node) {
        // console.log(node.callee.property);
        if (utils.getPropertyValue(node, 'callee.property.name') === 'addEventListener') {
        // if (node.callee.property.name === 'addEventListener') {
          const listener = {
            el: node.callee.object.name,
            event: node.arguments[0].value,
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
