'use strict';

const { getImportIdentifier } = require('../utils/import');
const types = require('../utils/types');

const ERROR_MESSAGE_AND_OR = 'Computed property macro should be used with 2+ arguments';

const COMPUTED_MACROS_AND_OR = ['and', 'or'];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow incorrect usage of computed property macros',
      category: 'Possible Errors',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-incorrect-computed-macros.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE_AND_OR,

  create(context) {
    let macroIdentifiersAndOr = [];

    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@ember/object/computed') {
          return;
        }

        // Gather the identifiers that these macros are imported under.
        macroIdentifiersAndOr = COMPUTED_MACROS_AND_OR.map((fn) =>
          getImportIdentifier(node, '@ember/object/computed', fn)
        );
      },

      CallExpression(node) {
        if (types.isIdentifier(node.callee) && macroIdentifiersAndOr.includes(node.callee.name)) {
          if (node.arguments.length === 1 && !types.isSpreadElement(node.arguments[0])) {
            context.report({
              node: node.callee,
              message: ERROR_MESSAGE_AND_OR,
              fix(fixer) {
                return fixer.replaceText(node.callee, 'readOnly');
              },
            });
          } else if (node.arguments.length === 0) {
            context.report(node, ERROR_MESSAGE_AND_OR);
          }
        }
      },
    };
  },
};
