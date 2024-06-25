'use strict';

const { ReferenceTracker } = require('eslint-utils');

const ERROR_MESSAGE = 'Explicitly import `fetch` instead of using `window.fetch`';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce explicit import for `fetch()`',
      category: 'Miscellaneous',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-fetch-import.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      'Program:exit'(node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

        const tracker = new ReferenceTracker(scope);

        const traceMap = {
          fetch: { [ReferenceTracker.CALL]: true },
        };

        for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
