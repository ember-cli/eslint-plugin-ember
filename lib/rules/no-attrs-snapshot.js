'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule -  Disallow use of attrs snapshot in `didReceiveAttrs`
// and `didUpdateAttrs`.
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  'Do not use the attrs snapshot that is passed in `didReceiveAttrs` and `didUpdateAttrs`.';

const hasAttrsSnapShot = function (node) {
  const methodName = utils.getPropertyValue(node, 'parent.key.name');
  const hasParams = node.params.length > 0;

  return (methodName === 'didReceiveAttrs' || methodName === 'didUpdateAttrs') && hasParams;
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow use of attrs snapshot in the `didReceiveAttrs` and `didUpdateAttrs` component hooks',
      category: 'Components',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-attrs-snapshot.md',
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
      FunctionExpression(node) {
        if (hasAttrsSnapShot(node)) {
          report(node);
        }
      },
    };
  },
};
