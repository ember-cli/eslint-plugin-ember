'use strict';

const ERROR_MESSAGE = 'Explicitly import `fetch` instead of using `window.fetch`';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce explicit import for `fetch()`',
      category: 'Miscellaneous',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-fetch-import.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let fetchImportFound = false;
    const fetchCalls = [];

    return {
      ImportDeclaration(node) {
        // search for a `fetch` import
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier') {
            if (specifier.local.type === 'Identifier' && specifier.local.name === 'fetch') {
              fetchImportFound = true;
            }
          }
        }
      },

      CallExpression(node) {
        // save all `fetch()` calls for later
        const { callee } = node;
        if (callee.type === 'Identifier' && callee.name === 'fetch') {
          fetchCalls.push(node);
        }
      },

      'Program:exit'() {
        // if there was no `fetch` import in the file, report all of the `fetch()` calls
        if (!fetchImportFound) {
          for (const node of fetchCalls) {
            context.report(node, ERROR_MESSAGE);
          }
        }
      },
    };
  },
};
