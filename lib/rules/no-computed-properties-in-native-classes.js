'use strict';

const utils = require('../utils/utils');
const { hasDecorator } = require('../utils/decorators');

const ERROR_MESSAGE =
  "Don't use computed properties with native classes. Use getters or @tracked properties instead.";

/**
 * Locates all the ImportDeclaration with computed properties.
 * @param {Node[]} nodeBody Array of nodes.
 * @returns {Node[]} Array of nodes with .
 */
function findComputedNodes(nodeBody) {
  const importDeclarations = utils.findNodes(nodeBody, 'ImportDeclaration');
  return importDeclarations.filter((node) => {
    return (
      node.source.value === '@ember/object/computed' ||
      (node.source.value === '@ember/object' &&
        node.specifiers.some((s) => (s.imported ? s.imported.name : s.local.name) === 'computed'))
    );
  });
}

//----------------------------------------------
// General rule - Do not use computed properties in native classes
//----------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using computed properties in native classes',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-computed-properties-in-native-classes.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreClassic: {
            type: 'boolean',
            default: true,
            description:
              'Whether the rule should ignore usage inside of native classes labeled with `@classic`.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const ignoreClassic = !context.options[0] || context.options[0].ignoreClassic;
    let computedNodes = [];

    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
    };

    return {
      Program(node) {
        computedNodes = findComputedNodes(node.body);
      },
      ClassDeclaration(node) {
        for (const importNode of computedNodes) {
          if (!ignoreClassic || !hasDecorator(node, 'classic')) {
            report(importNode);
          }
        }
      },
    };
  },

  ERROR_MESSAGE,
};
