'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General rule -  Disallow use of attrs snapshot in `didReceiveAttrs`
// and `didUpdateAttrs`.
//------------------------------------------------------------------------------

const message =
  'Do not use the attrs snapshot that is passed in `didReceiveAttrs` and `didUpdateAttrs`. Please see the following guide for more information: https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-attrs-snapshot.md';

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of attrs snapshot in `didReceiveAttrs` and `didUpdateAttrs`',
      category: 'Possible Errors',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-attrs-snapshot.md',
    },
    fixable: null, // or "code" or "whitespace"
    message,
  },
  create(context) {
    const hasAttrsSnapShot = function(node) {
      const methodName = utils.getPropertyValue(node, 'parent.key.name');
      const hasParams = node.params.length > 0;

      return (methodName === 'didReceiveAttrs' || methodName === 'didUpdateAttrs') && hasParams;
    };

    const report = function(node) {
      context.report(node, message);
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
