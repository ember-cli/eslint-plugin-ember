'use strict';

const emberUtils = require('../utils/ember');

const ERROR_MESSAGE = "No 'Replace this with your real tests' comments. Add a substantive test.";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow 'Replace this with your real tests' comments in test files",
      category: 'Testing',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-replace-test-comments.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const checkForRealTestsComment = (node) => {
      const { value = '' } = node || {};
      const regex = /replace this with your real tests/i;
      const message = ERROR_MESSAGE;
      if (regex.test(value)) {
        context.report({ node, message });
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }
    return {
      Program(/* node */) {
        const sourceCode = context.getSourceCode() || {};
        const comments = sourceCode.getAllComments() || [];
        for (const comment of comments) {
          checkForRealTestsComment(comment);
        }
      },
    };
  },
};
