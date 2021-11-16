'use strict';

const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  'Dependent keys containing `@each` only work one level deep. You cannot use nested forms like: `todos.@each.owner.name`. Please create an intermediary computed property instead.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of deeply-nested computed property dependent keys with `@each`',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-deeply-nested-dependent-keys-with-each.md',
    },
    fixable: null,
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
        if (emberUtils.isComputedProp(node, importedEmberName, importedComputedName)) {
          for (const key of emberUtils.parseDependentKeys(node)) {
            const parts = key.split('.');
            const indexOfAtEach = parts.indexOf('@each');
            if (indexOfAtEach < 0) {
              continue;
            }
            if (parts.length > indexOfAtEach + 2) {
              context.report({
                node,
                message: ERROR_MESSAGE,
              });
            }
          }
        }
      },
    };
  },
};
