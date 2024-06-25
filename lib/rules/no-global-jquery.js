'use strict';

const { ReferenceTracker } = require('eslint-utils');
const { globalMap } = require('../utils/jquery');

const ERROR_MESSAGE = 'Do not use global `$` or `jQuery`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of global jQuery object',
      category: 'jQuery',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-global-jquery.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      Program(node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

        const tracker = new ReferenceTracker(scope);

        for (const { node } of tracker.iterateGlobalReferences(globalMap)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
