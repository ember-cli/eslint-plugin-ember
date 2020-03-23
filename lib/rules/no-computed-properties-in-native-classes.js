'use strict';

const utils = require('../utils/utils');

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

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using computed properties in native classes',
      category: 'Ember Octane',
      recommended: false,
      octane: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-computed-properties-in-native-classes.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    let computedNodes = [];

    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    return {
      Program(node) {
        computedNodes = findComputedNodes(node.body);
      },
      ClassDeclaration() {
        computedNodes.forEach((importNode) => {
          report(importNode);
        });
      },
    };
  },

  ERROR_MESSAGE,
};
