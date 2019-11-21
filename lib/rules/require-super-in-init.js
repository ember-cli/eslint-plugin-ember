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
    fnExpressions.forEach(item => {
      nodes.push(item);
    });
  }

  if (returnStatement.length !== 0) {
    returnStatement.forEach(item => {
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

  return nodes.some(n => {
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
      description: 'Enforces super calls in init hooks',
      category: 'Possible Errors',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-super-in-init.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = 'Call this._super(...arguments) in init hook';

    const report = function(node) {
      context.report(node, message);
    };

    return {
      'CallExpression > MemberExpression[property.name="extend"]'(memberExpressionNode) {
        const node = memberExpressionNode.parent;

        if (
          !ember.isEmberComponent(context, node) &&
          !ember.isEmberController(context, node) &&
          !ember.isEmberRoute(context, node) &&
          !ember.isEmberMixin(context, node) &&
          !ember.isEmberService(context, node)
        ) {
          return;
        }

        const initProperty = ember
          .getModuleProperties(node)
          .find(property => property.key.name === 'init');

        if (initProperty && types.isFunctionExpression(initProperty.value)) {
          const initPropertyBody = initProperty.value.body.body;
          const nodes = findStmtNodes(initPropertyBody);
          const hasSuper = checkForSuper(nodes);
          if (!hasSuper) {
            report(initProperty);
          }
        }
      },
    };
  },
};
