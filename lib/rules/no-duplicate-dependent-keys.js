'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');
const fixerUtils = require('../utils/fixer');
const javascriptUtils = require('../utils/javascript');

const ERROR_MESSAGE = 'Dependent keys should not be repeated';
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow repeating computed property dependent keys',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-duplicate-dependent-keys.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        if (emberUtils.hasDuplicateDependentKeys(node)) {
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

              return javascriptUtils.flat(
                duplicateNodes.map((duplicateNode) =>
                  fixerUtils.removeCommaSeparatedNode(duplicateNode, sourceCode, fixer)
                )
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

  stringNodes.forEach((node) => {
    if (seenNodes.has(node.value)) {
      duplicateNodes.push(node);
    } else {
      seenNodes.add(node.value);
    }
  });

  return duplicateNodes;
}
