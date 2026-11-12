'use strict';

const utils = require('../utils/utils');
const emberUtils = require('../utils/ember');
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

/**
 * Gets the import specifiers that bring in computed properties.
 * @param {Node} importNode An ImportDeclaration from findComputedNodes.
 * @returns {Node[]} The computed specifiers.
 */
function getComputedSpecifiers(importNode) {
  if (importNode.source.value === '@ember/object/computed') {
    return importNode.specifiers;
  }
  return importNode.specifiers.filter(
    (s) => s.type === 'ImportSpecifier' && s.imported.name === 'computed'
  );
}

/**
 * Checks if the closest class around a node has the `@classic` decorator.
 * @param {Node} node Any node.
 * @returns {boolean} Whether the node is inside a classic class.
 */
function isInClassicClass(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (current.type === 'ClassDeclaration' || current.type === 'ClassExpression') {
      return hasDecorator(current, 'classic');
    }
  }
  return false;
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
    const sourceCode = context.sourceCode;
    let computedNodes = [];
    let hasClassicExtend = false;
    const nativeClasses = [];

    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
    };

    return {
      Program(node) {
        computedNodes = findComputedNodes(node.body);
      },
      ClassDeclaration(node) {
        if (!ignoreClassic || !hasDecorator(node, 'classic')) {
          nativeClasses.push(node);
        }
      },
      CallExpression(node) {
        if (emberUtils.isAnyEmberCoreModule(context, node)) {
          hasClassicExtend = true;
        }
      },
      'Program:exit'() {
        // Only report if there are native classes and no classic .extend() calls,
        // since classic classes legitimately use computed properties.
        if (nativeClasses.length > 0 && !hasClassicExtend) {
          for (const importNode of computedNodes) {
            const references = getComputedSpecifiers(importNode)
              .flatMap((specifier) => sourceCode.getDeclaredVariables(specifier))
              .flatMap((variable) => variable.references);
            // Computed properties that are only used inside `@classic` classes are fine.
            if (
              ignoreClassic &&
              references.length > 0 &&
              references.every((ref) => isInClassicClass(ref.identifier))
            ) {
              continue;
            }
            report(importNode);
          }
        }
      },
    };
  },

  ERROR_MESSAGE,
};
