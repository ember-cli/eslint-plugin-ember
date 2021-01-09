'use strict';

const { ReferenceTracker } = require('eslint-utils');

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
          $: { [ReferenceTracker.CALL]: true },
          jQuery: { [ReferenceTracker.CALL]: true },
        };

        for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
