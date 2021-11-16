'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Do not use arrow functions in computed properties';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,

  meta: {
    type: 'problem',
    docs: {
      description: 'disallow arrow functions in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-arrow-function-computed-properties.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          onlyThisContexts: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const onlyThisContexts = options.onlyThisContexts || false;

    let isThisPresent = false;

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

      ThisExpression() {
        isThisPresent = true;
      },
      CallExpression() {
        isThisPresent = false;
      },
      'CallExpression:exit'(node) {
        const isComputedArrow =
          emberUtils.isComputedProp(node, importedEmberName, importedComputedName, {
            includeMacro: true,
          }) &&
          node.arguments.length > 0 &&
          types.isArrowFunctionExpression(node.arguments[node.arguments.length - 1]);

        if (!isComputedArrow) {
          return;
        }

        if (onlyThisContexts) {
          if (isThisPresent) {
            context.report({
              node: node.arguments[node.arguments.length - 1],
              message: ERROR_MESSAGE,
            });
          }
        } else {
          context.report({
            node: node.arguments[node.arguments.length - 1],
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
