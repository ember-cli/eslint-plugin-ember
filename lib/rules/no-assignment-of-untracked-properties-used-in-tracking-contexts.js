'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');
const decoratorUtils = require('../utils/decorators');
const propertySetterUtils = require('../utils/property-setter');
const { getImportIdentifier } = require('../utils/import');
const { getMacros } = require('../utils/computed-property-macros');
const {
  findComputedPropertyDependentKeys,
  keyExistsAsPrefixInList,
} = require('../utils/computed-property-dependent-keys');

const ERROR_MESSAGE =
  "Use `set(this, 'propertyName', 'value')` instead of assignment for untracked properties that are used as computed property dependencies (or convert to using tracked properties).";

/**
 * Gets a set of tracked properties used inside a class.
 *
 * @param {Node} nodeClass - Node for the class
 * @returns {Set<string>} - set of tracked properties used inside the class
 */
function findTrackedProperties(nodeClassDeclaration, trackedImportName) {
  return new Set(
    nodeClassDeclaration.body.body
      .filter(
        (node) =>
          types.isClassProperty(node) &&
          decoratorUtils.hasDecorator(node, trackedImportName) &&
          types.isIdentifier(node.key)
      )
      .map((node) => node.key.name)
  );
}

class Stack {
  constructor() {
    this.stack = new Array();
  }
  pop() {
    return this.stack.pop();
  }
  push(item) {
    this.stack.push(item);
  }
  peek() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
  }
  size() {
    return this.stack.length;
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow assignment of untracked properties that are used as computed property dependencies',
      category: 'Computed Properties',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    if (emberUtils.isTestFile(context.getFilename())) {
      // This rule does not apply to test files.
      return {};
    }

    // State being tracked for this file.
    let computedImportName = undefined;
    let trackedImportName = undefined;
    let setImportName = undefined;
    let macroImportNames = new Map();

    // State being tracked for the current class we're inside.
    const classStack = new Stack();

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          computedImportName =
            computedImportName || getImportIdentifier(node, '@ember/object', 'computed');
          setImportName = setImportName || getImportIdentifier(node, '@ember/object', 'set');
        } else if (node.source.value === '@ember/object/computed') {
          macroImportNames = new Map(
            getMacros().map((macro) => [
              macro,
              macroImportNames.get(macro) ||
                getImportIdentifier(node, '@ember/object/computed', macro),
            ])
          );
        } else if (node.source.value === '@glimmer/tracking') {
          trackedImportName =
            trackedImportName || getImportIdentifier(node, '@glimmer/tracking', 'tracked');
        }
      },

      // Native JS class:
      ClassDeclaration(node) {
        // Gather computed property dependent keys from this class.
        const computedPropertyDependentKeys = findComputedPropertyDependentKeys(
          node,
          computedImportName,
          macroImportNames
        );

        // Gather tracked properties from this class.
        const trackedProperties = findTrackedProperties(node, trackedImportName);

        // Keep track of whether we're inside a Glimmer component.
        const isGlimmerComponent = emberUtils.isGlimmerComponent(context, node);

        classStack.push({
          node,
          computedPropertyDependentKeys,
          trackedProperties,
          isGlimmerComponent,
        });
      },

      CallExpression(node) {
        // Classic class:
        if (emberUtils.isAnyEmberCoreModule(context, node)) {
          // Gather computed property dependent keys from this class.
          const computedPropertyDependentKeys = findComputedPropertyDependentKeys(
            node,
            computedImportName,
            macroImportNames
          );

          // No tracked properties in classic classes.
          const trackedProperties = new Set();

          // Keep track of whether we're inside a Glimmer component.
          const isGlimmerComponent = emberUtils.isGlimmerComponent(context, node);

          classStack.push({
            node,
            computedPropertyDependentKeys,
            trackedProperties,
            isGlimmerComponent,
          });
        }
      },

      'ClassDeclaration:exit'(node) {
        if (classStack.size() > 0 && classStack.peek().node === node) {
          // Leaving current (native) class.
          classStack.pop();
        }
      },

      'CallExpression:exit'(node) {
        if (classStack.size() > 0 && classStack.peek().node === node) {
          // Leaving current (classic) class.
          classStack.pop();
        }
      },

      AssignmentExpression(node) {
        if (classStack.size() === 0) {
          // Not inside a class.
          return;
        }

        // Ensure this is an assignment with `this.x = ` or `this.x.y = `.
        if (!propertySetterUtils.isThisSet(node)) {
          return;
        }

        const currentClass = classStack.peek();

        const sourceCode = context.getSourceCode();
        const nodeTextLeft = sourceCode.getText(node.left);
        const nodeTextRight = sourceCode.getText(node.right);
        const propertyName = nodeTextLeft.replace('this.', '');

        if (currentClass.isGlimmerComponent && propertyName.startsWith('args.')) {
          // The Glimmer component args hash is automatically tracked so ignored it.
          return;
        }

        if (
          !currentClass.computedPropertyDependentKeys.has(propertyName) &&
          !keyExistsAsPrefixInList(
            [...currentClass.computedPropertyDependentKeys.keys()],
            propertyName
          )
        ) {
          // Haven't seen this property as a computed property dependent key so ignore it.
          return;
        }

        if (currentClass.trackedProperties.has(propertyName)) {
          // Assignment is fine with tracked properties so ignore it.
          return;
        }

        context.report({
          node,
          message: ERROR_MESSAGE,
          fix(fixer) {
            if (setImportName) {
              // `set` is already imported.
              return fixer.replaceText(
                node,
                `${setImportName}(this, '${propertyName}', ${nodeTextRight})`
              );
            } else {
              // Need to add an import statement for `set`.
              const sourceCode = context.getSourceCode();
              return [
                fixer.insertTextBefore(sourceCode.ast, "import { set } from '@ember/object';\n"),
                fixer.replaceText(node, `set(this, '${propertyName}', ${nodeTextRight})`),
              ];
            }
          },
        });
      },
    };
  },
};
