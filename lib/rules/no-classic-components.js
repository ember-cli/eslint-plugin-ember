'use strict';

const types = require('../utils/types');
const assert = require('assert');

const ERROR_MESSAGE =
  'Use Glimmer components(@glimmer/component) instead of classic components(@ember/component)';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using Glimmer components',
      category: 'Components',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-classic-components.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
    };

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/component') {
          const importDefaultSpecifier = getImportDefaultSpecifier(node);
          if (importDefaultSpecifier) {
            report(importDefaultSpecifier);
          }
        }
      },
    };
  },
};

function getImportDefaultSpecifier(node) {
  assert(types.isImportDeclaration(node));
  return node.specifiers.find((specifier) => types.isImportDefaultSpecifier(specifier));
}
