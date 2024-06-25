'use strict';

const emberUtils = require('../utils/ember');
const { ReferenceTracker } = require('eslint-utils');

//-------------------------------------------------------------------------------------
// Rule Definition
//-------------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `@ember/test-helpers` methods over native window methods',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/prefer-ember-test-helpers.md',
    },
    schema: [],
  },

  create: (context) => {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    const showErrorMessage = (node, methodName) => {
      context.report({
        data: { methodName },
        message: 'Import the `{{methodName}}()` method from @ember/test-helpers',
        node,
      });
    };

    return {
      Program(node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

        const tracker = new ReferenceTracker(scope);
        const traceMap = {
          blur: { [ReferenceTracker.CALL]: true },
          find: { [ReferenceTracker.CALL]: true },
          focus: { [ReferenceTracker.CALL]: true },
        };

        for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
          showErrorMessage(node, node.callee.name);
        }
      },
    };
  },
};
