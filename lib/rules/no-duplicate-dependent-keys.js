'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');
const fixerUtils = require('../utils/fixer');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Dependent keys should not be repeated';
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow repeating computed property dependent keys',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-duplicate-dependent-keys.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

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
        if (emberUtils.hasDuplicateDependentKeys(node, importedEmberName, importedComputedName)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
            fix(fixer) {
              const sourceCode = context.getSourceCode();

              const stringNodes = node.arguments.filter((arg) => types.isStringLiteral(arg));
              const duplicateNodes = findDuplicateStringNodes(stringNodes);

              if (duplicateNodes.length === 0) {
                return null;
              }

              return duplicateNodes.flatMap((duplicateNode) =>
                fixerUtils.removeCommaSeparatedNode(duplicateNode, sourceCode, fixer)
              );
            },
          });
        }
      },
    };
  },
};

function findDuplicateStringNodes(stringNodes) {
  const seenNodes = new Set();
  const duplicateNodes = [];

  for (const node of stringNodes) {
    if (seenNodes.has(node.value)) {
      duplicateNodes.push(node);
    } else {
      seenNodes.add(node.value);
    }
  }

  return duplicateNodes;
}
