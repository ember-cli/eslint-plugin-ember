'use strict';

const { hasDecorator } = require('../utils/decorators');

const ERROR_MESSAGE =
  "Don't use computed properties with native classes. Use getters or @tracked properties instead.";

/**
 * Gets the import specifiers that bring in computed properties.
 * @param {Node} importNode An ImportDeclaration.
 * @returns {Node[]} The computed specifiers.
 */
function getComputedSpecifiers(importNode) {
  if (importNode.source.value === '@ember/object/computed') {
    return importNode.specifiers;
  }
  if (importNode.source.value === '@ember/object') {
    return importNode.specifiers.filter(
      (s) => s.type === 'ImportSpecifier' && s.imported.name === 'computed'
    );
  }
  return [];
}

/**
 * Finds the class whose body contains a node.
 * Nodes in a class's `extends` clause or decorators are not in its body.
 * @param {Node} node Any node.
 * @returns {Node|undefined} The closest class with the node in its body.
 */
function getEnclosingClass(node) {
  let child = node;
  for (let current = node.parent; current; current = current.parent) {
    if (
      (current.type === 'ClassDeclaration' || current.type === 'ClassExpression') &&
      current.body === child
    ) {
      return current;
    }
    child = current;
  }
  return undefined;
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

    return {
      ImportDeclaration(node) {
        const references = getComputedSpecifiers(node)
          .flatMap((specifier) => sourceCode.getDeclaredVariables(specifier))
          .flatMap((variable) => variable.references);

        for (const { identifier } of references) {
          const classNode = getEnclosingClass(identifier);
          if (classNode && !(ignoreClassic && hasDecorator(classNode, 'classic'))) {
            context.report({ node: identifier, message: ERROR_MESSAGE });
          }
        }
      },
    };
  },

  ERROR_MESSAGE,
};
