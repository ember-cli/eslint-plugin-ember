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

    // Variables of the imported computed properties / macros.
    const computedVariables = new Set();
    const computedNames = new Set();
    // One entry per class body we are in: whether computed is disallowed there.
    const classBodyStack = [];

    return {
      ImportDeclaration(node) {
        for (const specifier of getComputedSpecifiers(node)) {
          for (const variable of sourceCode.getDeclaredVariables(specifier)) {
            computedVariables.add(variable);
            computedNames.add(variable.name);
          }
        }
      },

      ClassBody(node) {
        classBodyStack.push(!(ignoreClassic && hasDecorator(node.parent, 'classic')));
      },

      'ClassBody:exit'() {
        classBodyStack.pop();
      },

      Identifier(node) {
        if (!classBodyStack.at(-1) || !computedNames.has(node.name)) {
          return;
        }
        const reference = sourceCode
          .getScope(node)
          .references.find((ref) => ref.identifier === node);
        if (reference && computedVariables.has(reference.resolved)) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },

  ERROR_MESSAGE,
};
