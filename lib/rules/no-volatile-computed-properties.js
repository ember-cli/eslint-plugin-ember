'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Do not use volatile computed properties';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,

  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow volatile computed properties',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-volatile-computed-properties.md',
    },
    schema: [],
  },

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
        if (
          types.isMemberExpression(node.callee) &&
          types.isCallExpression(node.callee.object) &&
          emberUtils.isComputedProp(node.callee.object, importedEmberName, importedComputedName) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'volatile'
        ) {
          context.report({ node: node.callee.property, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
