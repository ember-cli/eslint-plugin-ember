'use strict';

const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Do not use built-in form components. Use native HTML elements instead.';
const DISALLOWED_IMPORTS = new Set(['Input', 'Textarea']);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of built-in form components',
      category: 'Components',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-builtin-form-components.md',
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
          // Check for named imports like: import { Input } from '@ember/component';
          const namedImports = node.specifiers.filter(
            (specifier) =>
              specifier.type === 'ImportSpecifier' &&
              DISALLOWED_IMPORTS.has(specifier.imported.name)
          );

          if (namedImports.length > 0) {
            for (const specifier of namedImports) {
              report(specifier);
            }
          }
        }
      },
    };
  },
};
