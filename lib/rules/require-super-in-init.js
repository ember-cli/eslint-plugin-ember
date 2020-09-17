'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');
const types = require('../utils/types');

/**
 * Locates nodes with either an ExpressionStatement or ReturnStatement
 * given name.
 * @param {Node[]} nodeBody Array of nodes.
 * @returns {Node[]} Array of nodes with given names.
 */
function findStmtNodes(nodeBody) {
  const nodes = [];
  const fnExpressions = utils.findNodes(nodeBody, 'ExpressionStatement');
  const returnStatement = utils.findNodes(nodeBody, 'ReturnStatement');

  if (fnExpressions.length !== 0) {
    fnExpressions.forEach((item) => {
      nodes.push(item);
    });
  }

  if (returnStatement.length !== 0) {
    returnStatement.forEach((item) => {
      nodes.push(item);
    });
  }

  return nodes;
}

/**
 * Checks whether a node has the '_super' property.
 * @param {Node[]} nodes An array of nodes.
 * @returns {Boolean}
 */
function checkForSuper(nodes) {
  if (nodes.length === 0) {
    return false;
  }

  return nodes.some((n) => {
    if (types.isCallExpression(n.expression)) {
      const fnCallee = n.expression.callee;
      return (
        types.isMemberExpression(fnCallee) &&
        types.isThisExpression(fnCallee.object) &&
        types.isIdentifier(fnCallee.property) &&
        fnCallee.property.name === '_super'
      );
    } else if (types.isReturnStatement(n)) {
      if (!n.argument || !types.isCallExpression(n.argument)) {
        return false;
      }

      const fnCallee = n.argument.callee;
      return fnCallee.property.name === '_super';
    }

    return false;
  });
}

//----------------------------------------------
// General rule - Call _super in init lifecycle hooks
//----------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `this._super` to be called in `init` hooks',
      category: 'Ember Object',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-super-in-init.md',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    const message = 'Call this._super(...arguments) in init hook';

    const report = function (node) {
      context.report({
        node,
        message,
        fix(fixer) {
          if (node.value.body.body.length > 0) {
            // Function has at least one statement in it so just insert before that.
            return fixer.insertTextBefore(node.value.body.body[0], 'this._super(...arguments);\n');
          } else {
            // Function is empty so insert after curly brace.
            const sourceCode = context.getSourceCode();
            const startOfBlockStatement = sourceCode.getFirstToken(node.value.body);
            return fixer.insertTextAfter(startOfBlockStatement, 'this._super(...arguments);');
          }
        },
      });
    };

    return {
      Property(node) {
        if (
          !types.isIdentifier(node.key) ||
          node.key.name !== 'init' ||
          !types.isFunctionExpression(node.value)
        ) {
          // Not init function.
          return;
        }

        const parentParent = node.parent.parent;
        if (!types.isCallExpression(node.parent.parent)) {
          // Not inside potential Ember class.
          return;
        }

        if (
          !ember.isEmberComponent(context, parentParent) &&
          !ember.isEmberController(context, parentParent) &&
          !ember.isEmberRoute(context, parentParent) &&
          !ember.isEmberMixin(context, parentParent) &&
          !ember.isEmberService(context, parentParent)
        ) {
          // Not inside an Ember class.
          return;
        }

        const initPropertyBody = node.value.body.body;
        const nodes = findStmtNodes(initPropertyBody);
        const hasSuper = checkForSuper(nodes);
        if (!hasSuper) {
          report(node);
        }
      },
    };
  },
};
