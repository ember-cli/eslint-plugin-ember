'use strict';

const types = require('../utils/types');

//------------------------------------------------------------------------------
// Components - Closure actions
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Use closure actions';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of closure actions',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/closure-actions.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
    };

    return {
      MemberExpression(node) {
        const isSendAction =
          types.isThisExpression(node.object) &&
          types.isIdentifier(node.property) &&
          node.property.name === 'sendAction';

        if (isSendAction) {
          report(node);
        }
      },
    };
  },
};
