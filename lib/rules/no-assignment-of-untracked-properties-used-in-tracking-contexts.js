'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');
const decoratorUtils = require('../utils/decorators');
const propertySetterUtils = require('../utils/property-setter');
const { getImportIdentifier } = require('../utils/import');
const { DEFAULT_MACRO_CONFIGURATIONS } = require('../utils/computed-property-macros');
const {
  findComputedPropertyDependentKeys,
  keyExistsAsPrefixInList,
} = require('../utils/computed-property-dependent-keys');
const Stack = require('../utils/stack');

function createMacrosByPathMap(macroConfigurations) {
  const macrosByPath = new Map();

  for (const config of macroConfigurations) {
    if (!macrosByPath.has(config.path)) {
      macrosByPath.set(config.path, new Map());
    }

    macrosByPath.get(config.path).set(config.name, config);
  }

  return macrosByPath;
}

function createMacrosByIndexPathMap(macroConfigurations) {
  const macrosByIndexPath = new Map();

  for (const config of macroConfigurations) {
    if (!macrosByIndexPath.has(config.indexPath)) {
      macrosByIndexPath.set(config.indexPath, new Map());
    }

    if (!macrosByIndexPath.get(config.indexPath).has(config.indexName)) {
      macrosByIndexPath.get(config.indexPath).set(config.indexName, new Map());
    }

    macrosByIndexPath.get(config.indexPath).get(config.indexName).set(config.name, config);
  }

  return macrosByIndexPath;
}

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
          types.isClassPropertyOrPropertyDefinition(node) &&
          decoratorUtils.hasDecorator(node, trackedImportName) &&
          (types.isIdentifier(node.key) || types.isStringLiteral(node.key))
      )
      .map((node) => node.key.name || node.key.value)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow assignment of untracked properties that are used as computed property dependencies',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          extraMacros: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              type: 'object',
              required: ['path', 'name'],
              dependencies: {
                indexPath: ['indexName'],
                indexName: ['indexPath'],
              },
              properties: {
                path: {
                  type: 'string',
                  minLength: 1,
                  // Extra macros cannot be in @ember/
                  pattern: '^(?!@ember/).+/',
                },
                name: {
                  type: 'string',
                  minLength: 1,
                },
                indexPath: {
                  type: 'string',
                  minLength: 1,
                  // Extra macros cannot be in @ember/
                  pattern: '^(?!@ember/).+/',
                },
                indexName: {
                  type: 'string',
                  minLength: 1,
                },
                argumentFormat: {
                  type: 'array',
                  uniqueItems: true,
                  minItems: 1,
                  items: {
                    type: 'object',
                    properties: {
                      strings: {
                        type: 'object',
                        properties: {
                          startIndex: {
                            type: 'number',
                            multipleOf: 1,
                            default: 0,
                            minimum: 0,
                          },
                          count: {
                            type: 'number',
                            default: Number.MAX_VALUE,
                            multipleOf: 1,
                            minimum: 1,
                          },
                        },
                      },
                      objects: {
                        type: 'object',
                        required: ['index'],
                        properties: {
                          keys: {
                            type: 'array',
                            uniqueItems: true,
                            minItems: 1,
                            items: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          index: {
                            type: 'number',
                            multipleOf: 1,
                            minimum: 0,
                          },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  ERROR_MESSAGE,

  create(context) {
    if (emberUtils.isTestFile(context.getFilename())) {
      // This rule does not apply to test files.
      return {};
    }

    const options = context.options[0] || { extraMacros: [] };

    const macroConfigurations = [...DEFAULT_MACRO_CONFIGURATIONS, ...options.extraMacros];

    const macrosByPath = createMacrosByPathMap(macroConfigurations);
    const macrosByIndexPath = createMacrosByIndexPathMap(macroConfigurations);

    // State being tracked for this file.
    let trackedImportName = undefined;
    let computedImportName = undefined;
    let setImportName = undefined;
    let macrosByName = new Map();
    let macrosByIndexName = new Map();

    // State being tracked for the current class we're inside.
    const classStack = new Stack();

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Checking for something like `import { readOnly } from '@ember/object/computed;`
        if (macrosByPath.has(importPath)) {
          const newMacroImportNameEntries = [...macrosByPath.get(importPath)]
            .map(([name, config]) => [getImportIdentifier(node, importPath, name), config])
            .filter(([importedName]) => importedName);
          macrosByName = new Map([...macrosByName, ...newMacroImportNameEntries]);
        }

        // Checking for something like `import { computed } from '@ember/object;`
        if (macrosByIndexPath.has(importPath)) {
          const newMacroIndexImportEntries = [...macrosByIndexPath.get(importPath)]
            .map(([indexName, propertyConfigs]) => [
              getImportIdentifier(node, importPath, indexName),
              propertyConfigs,
            ])
            .filter(([importedName]) => importedName);

          macrosByIndexName = new Map([...macrosByIndexName, ...newMacroIndexImportEntries]);
        }

        if (node.source.value === '@ember/object') {
          setImportName = setImportName || getImportIdentifier(node, '@ember/object', 'set');
          computedImportName =
            computedImportName || getImportIdentifier(node, '@ember/object', 'computed');
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
          macrosByName,
          macrosByIndexName
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
            macrosByName,
            macrosByIndexName
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
