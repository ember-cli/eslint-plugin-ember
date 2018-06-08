/**
 * @fileOverview no importing of test files and no exporting in test files
 */

'use strict';

const NO_IMPORT_MESSAGE
  = 'Do not import "-test.js" file in a test file. This will cause the module and tests from the imported file to be executed again.';

const NO_EXPORT_MESSAGE
  = 'No exports from test file. Any exports should be done in a test helper.';

module.exports = {
  docs: {
    description:
      'Disallow importing of "-test.js" in a test file and exporting from a test file.',
    category: 'Testing',
    recommended: false
  },
  meta: {
    import_message: NO_IMPORT_MESSAGE,
    export_message: NO_EXPORT_MESSAGE
  },

  create: function create(context) {
    const noExports = function (node) {
      const fileName = context.getFilename();
      if (!fileName.endsWith('-test.js')) {
        return;
      }

      context.report({
        message: NO_EXPORT_MESSAGE,
        node
      });
    }
    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource.endsWith('-test')) {
          context.report({
            message: NO_IMPORT_MESSAGE,
            node
          });
        }
      },
      ExportNamedDeclaration(node) {
        noExports(node);
      },
      ExportDefaultDeclaration(node) {
        noExports(node);
      }
    };
  }
};
