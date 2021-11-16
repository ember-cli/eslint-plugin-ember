'use strict';

const ERROR_MESSAGE = 'Do not use `htmlSafe`.';
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of `htmlSafe`',
      category: 'Miscellaneous',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-html-safe.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let importedHtmlSafeName;

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource === '@ember/string') {
          importedHtmlSafeName =
            importedHtmlSafeName || getImportIdentifier(node, '@ember/string', 'htmlSafe');
        } else if (importSource === '@ember/template') {
          importedHtmlSafeName =
            importedHtmlSafeName || getImportIdentifier(node, '@ember/template', 'htmlSafe');
        }
      },

      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === importedHtmlSafeName) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
