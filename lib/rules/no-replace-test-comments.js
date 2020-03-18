/**
 * @fileoverview No 'Replace this with your real tests' comments
 * @author Jay Gruber
 */

'use strict';

const ERROR_MESSAGE = "No 'Replace this with your real tests' comments. Add a substantive test.";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow 'Replace this with your real tests' comments",
      category: 'Testing',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-replace-test-comments.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const checkForRealTestsComment = node => {
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

    return {
      Program(/* node */) {
        const sourceCode = context.getSourceCode() || {};
        const comments = sourceCode.getAllComments() || [];
        comments.forEach(checkForRealTestsComment);
      },
    };
  },
};
