'use strict';

const { getImportIdentifier } = require('../utils/import');
const types = require('../utils/types');

const ERROR_MESSAGE_AND_OR = 'Computed property macro should be used with 2+ arguments';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow incorrect usage of computed property macros',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-incorrect-computed-macros.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE_AND_OR,

  create(context) {
    let importNameAnd = undefined;
    let importNameOr = undefined;
    let importNameReadOnly = undefined;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object/computed') {
          // Gather the identifiers that these macros are imported under.
          importNameAnd =
            importNameAnd || getImportIdentifier(node, '@ember/object/computed', 'and');
          importNameOr = importNameOr || getImportIdentifier(node, '@ember/object/computed', 'or');
          importNameReadOnly =
            importNameReadOnly || getImportIdentifier(node, '@ember/object/computed', 'readOnly');
        }
      },

      CallExpression(node) {
        if (
          types.isIdentifier(node.callee) &&
          [importNameAnd, importNameOr].includes(node.callee.name)
        ) {
          if (
            node.arguments.length === 1 &&
            types.isStringLiteral(node.arguments[0]) &&
            !node.arguments[0].value.includes('{')
          ) {
            context.report({
              node: node.callee,
              message: ERROR_MESSAGE_AND_OR,
              fix(fixer) {
                if (importNameReadOnly) {
                  return fixer.replaceText(node.callee, importNameReadOnly);
                } else {
                  const sourceCode = context.getSourceCode();
                  return [
                    fixer.insertTextBefore(
                      sourceCode.ast,
                      "import { readOnly } from '@ember/object/computed';\n"
                    ),
                    fixer.replaceText(node.callee, 'readOnly'),
                  ];
                }
              },
            });
          } else if (node.arguments.length === 0) {
            context.report({ node, message: ERROR_MESSAGE_AND_OR });
          }
        }
      },
    };
  },
};
