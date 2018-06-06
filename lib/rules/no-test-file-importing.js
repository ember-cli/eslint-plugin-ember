/**
 * @fileOverview no importing of test files are allowed
 */

'use strict';

const REPORT_MESSAGE
  = 'Do not import "-test.js" file in a test file. This will cause the module and tests from the imported file to be executed again.';

module.exports = {
  docs: {
    description:
      'Disallow importing of "-test.js" in a test file, which causes the module and tests from the imported file to be executed again.',
    category: 'Testing',
    recommended: false
  },
  meta: {
    message: REPORT_MESSAGE
  },

  create: function create(context) {
    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource.endsWith('-test')) {
          context.report({
            message: REPORT_MESSAGE,
            node
          });
        }
      }
    };
  }
};
