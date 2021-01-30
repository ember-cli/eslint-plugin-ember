'use strict';

const ERROR_MESSAGE = 'Do not use `htmlSafe`.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of htmlSafe',
      category: 'Miscellaneous',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-html-safe.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/string' || node.source.value === '@ember/template') {
          const htmlSafeImport = node.specifiers.find(
            (s) => (s.imported || s.local).name === 'htmlSafe'
          );
          if (htmlSafeImport) {
            context.report(htmlSafeImport, ERROR_MESSAGE);
          }
        }
      },
    };
  },
};
