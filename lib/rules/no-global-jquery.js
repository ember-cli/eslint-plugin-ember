'use strict';

const { ReferenceTracker } = require('eslint-utils');
const jqueryMethods = require('../utils/jquery-methods');

const jqueryMap = {
  [ReferenceTracker.CALL]: true,
};

for (const method of jqueryMethods) {
  jqueryMap[method] = { [ReferenceTracker.CALL]: true };
}

const ERROR_MESSAGE = 'Do not use global `$` or `jQuery`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of global jQuery object',
      category: 'jQuery',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-global-jquery.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      Program() {
        const tracker = new ReferenceTracker(context.getScope());
        const traceMap = {
          $: jqueryMap,
          jQuery: jqueryMap,
        };

        for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
