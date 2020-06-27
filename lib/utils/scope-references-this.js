'use strict';

const Traverser = require('../utils/traverser');

/**
 * Determines whether this AST node uses the `this` of the surrounding context.
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function scopeReferencesThis(node) {
  let result = false;

  new Traverser().traverse(node, {
    enter(node) {
      switch (node.type) {
        case 'FunctionDeclaration':
        case 'FunctionExpression':
          this.skip();
          break;

        case 'ThisExpression':
          result = true;
          this.break();
          break;

        default:
          // Ignored.
          break;
      }
    },
  });

  return result;
}

module.exports = scopeReferencesThis;
