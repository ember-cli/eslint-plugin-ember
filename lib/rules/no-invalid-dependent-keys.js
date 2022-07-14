'use strict';

const types = require('../utils/types');
const ember = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// General rule -  Dependent keys used for computed properties have to be valid.
//------------------------------------------------------------------------------

const ERROR_MESSAGE_UNBALANCED_BRACES = 'Found unbalanced braces in dependent key';
const ERROR_MESSAGE_UNNECESSARY_BRACES = 'Found unnecessary braces in dependent key';
const ERROR_MESSAGE_TERMINAL_AT_EACH = 'Found terminal `@each`, use `[]` instead';
const ERROR_MESSAGE_MIDDLE_BRACKETS = '`[]` should only be used at the end of the dependent key';
const ERROR_MESSAGE_LEADING_TRAILING_PERIOD = 'Found leading or trailing period in dependent key';
const ERROR_MESSAGE_INVALID_CHARACTER = 'Found invalid character in dependent key';

function hasUnbalancedBraces(str) {
  const foundBraces = str.match(/[{}]/g) || [];
  const openBraces = foundBraces.filter((c) => c === '{').length;
  const closeBraces = foundBraces.filter((c) => c === '}').length;
  return openBraces !== closeBraces;
}

const REGEXP_UNNECESSARY_BRACES = /{([^,.]+)}/g;
function hasUnnecessaryBraces(str) {
  return str.match(REGEXP_UNNECESSARY_BRACES);
}

function hasTerminalAtEach(str) {
  return str.endsWith('.@each');
}

function hasMiddleBrackets(str) {
  return str.includes('[].');
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid dependent keys in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-invalid-dependent-keys.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE_UNBALANCED_BRACES,
  ERROR_MESSAGE_UNNECESSARY_BRACES,
  ERROR_MESSAGE_TERMINAL_AT_EACH,
  ERROR_MESSAGE_MIDDLE_BRACKETS,
  ERROR_MESSAGE_LEADING_TRAILING_PERIOD,
  ERROR_MESSAGE_INVALID_CHARACTER,

  create(context) {
    let importedEmberName;
    let importedComputedName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
        }
      },

      CallExpression(node) {
        if (!ember.isComputedProp(node, importedEmberName, importedComputedName)) {
          return;
        }

        const stringArgs = node.arguments.filter(
          (arg) => types.isLiteral(arg) && typeof arg.value === 'string'
        );

        const sourceCode = context.getSourceCode();

        for (const node of stringArgs) {
          if (hasTerminalAtEach(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_TERMINAL_AT_EACH,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace('.@each', '.[]'));
              },
            });
          }

          if (hasUnbalancedBraces(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_UNBALANCED_BRACES,
            });
          }

          if (hasUnnecessaryBraces(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_UNNECESSARY_BRACES,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace(REGEXP_UNNECESSARY_BRACES, '$1'));
              },
            });
          }

          if (hasMiddleBrackets(node.value)) {
            context.report({
              node,
              message: ERROR_MESSAGE_MIDDLE_BRACKETS,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace('[].', '@each.'));
              },
            });
          }

          if (node.value.startsWith('.')) {
            context.report({
              node,
              message: ERROR_MESSAGE_LEADING_TRAILING_PERIOD,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace('.', '')); // Remove first period.
              },
            });
          }

          if (node.value.endsWith('.')) {
            context.report({
              node,
              message: ERROR_MESSAGE_LEADING_TRAILING_PERIOD,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, removeLastOccurrenceOf(nodeText, '.'));
              },
            });
          }

          if (node.value.includes(' ')) {
            context.report({
              node,
              message: ERROR_MESSAGE_INVALID_CHARACTER,
              fix(fixer) {
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(node, nodeText.replace(/ /g, '')); // Remove all spaces.
              },
            });
          }
        }
      },
    };
  },
};

function removeLastOccurrenceOf(strToSearch, strToRemove) {
  const posToRemove = strToSearch.lastIndexOf(strToRemove);
  return strToSearch.slice(0, posToRemove) + strToSearch.slice(posToRemove + 1);
}
