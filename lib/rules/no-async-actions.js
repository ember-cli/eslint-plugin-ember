'use strict';

const utils = require('../utils/utils');


//------------------------------------------------------------------------------
// General rule - Don't use async actions
//------------------------------------------------------------------------------


const message = 'Do not use async actions';

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of async actions in components',
      category: 'Possible Errors',
      url: 'http://ember-concurrency.com/docs/tutorial'
    },
    fixable: null,
  },

  create(context) {
    return {
      Property(node) {
        if (node.key.name === 'actions') {
          const props = node.value.properties;

          props.forEach((p) => {
            const body = p.value.body.body;
            if (p.value.async) {
              context.report({
                node: p,
                message,
              });
            } else if (body.length === 1 && utils.isReturnStatement(body[0])) {
              const retSt = body[0];
              if (retSt.argument.type === 'CallExpression' &&
                  retSt.argument.callee.property.name === 'then') {
                context.report({
                  node: retSt,
                  message,
                });
              }
            }
          });
        } else if (node.decorators) {
          if (node.decorators.find(d => d.expression.name === 'action')) {
            if (node.value.async) {
              context.report({
                node,
                message: 'Do not use async actions'
              });
            }
          }
        }
      }
    };
  }
};
