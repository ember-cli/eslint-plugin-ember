'use strict';

const { ReferenceTracker } = require('eslint-utils');
const { globalMap } = require('../utils/jquery');

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

        for (const { node } of tracker.iterateGlobalReferences(globalMap)) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
