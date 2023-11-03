'use strict';

const estraverse = require('estraverse');
const emberUtils = require('../utils/ember');
const computedPropertyUtils = require('../utils/computed-properties');
const types = require('../utils/types');
const utils = require('../utils/utils');
const propertyGetterUtils = require('../utils/property-getter');
const computedPropertyDependentKeyUtils = require('../utils/computed-property-dependent-keys');
const assert = require('assert');
const { getImportIdentifier } = require('../utils/import');

/**
 * Checks whether the node is an identifier with the given name.
 *
 * @param {ASTNode} node
 * @param {string} name
 * @returns {boolean}
 */
function isIdentifier(node, name) {
  if (!types.isIdentifier(node)) {
    return false;
  }

  return node.name === name;
}

/**
 * Determines whether a node is a simple member expression with the given object
 * and property.
 *
 * @param {ASTNode} node
 * @param {string} objectName
 * @param {string} propertyName
 * @returns {boolean}
 */
function isMemberExpression(node, objectName, propertyName) {
  return (
    node &&
    types.isMemberExpression(node) &&
    !node.computed &&
    (objectName === 'this'
      ? types.isThisExpression(node.object)
      : isIdentifier(node.object, objectName)) &&
    isIdentifier(node.property, propertyName)
  );
}

/**
 * Checks if a node looks like: 'part1' + 'part2'
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isTwoPartStringLiteral(node) {
  return (
    types.isBinaryExpression(node) &&
    types.isStringLiteral(node.left) &&
    types.isStringLiteral(node.right)
  );
}

/**
 * Returns the string represented by the node.
 *
 * @param {ASTNode} node
 * @returns {string}
 */
function nodeToStringValue(node) {
  if (types.isStringLiteral(node)) {
    return node.value;
  } else if (isTwoPartStringLiteral(node)) {
    return node.left.value + node.right.value;
  } else {
    assert(false);
    return undefined;
  }
}

/**
 * Splits arguments to `Ember.computed` into string keys and dynamic keys.
 *
 * @param {Array<ASTNode>} args
 * @returns {{keys: Array<ASTNode>, dynamicKeys: Array<ASTNode>}}
 */
function parseComputedDependencies(args) {
  const keys = [];
  const dynamicKeys = [];

  for (const arg of args) {
    if (types.isStringLiteral(arg) || isTwoPartStringLiteral(arg)) {
      keys.push(arg);
    } else if (!computedPropertyUtils.isComputedPropertyBodyArg(arg)) {
      dynamicKeys.push(arg);
    }
  }

  return { keys, dynamicKeys };
}

/**
 * Recursively finds all calls to `Ember#get`, whether like `Ember.get(this, …)`
 * or `this.get(…)`.
 *
 * @param {ASTNode} node
 * @param {object} importedNames
 * @returns {Array<ASTNode>}
 */
function findEmberGetCalls(node, importedNames) {
  const results = [];

  estraverse.traverse(node, {
    enter(child) {
      if (types.isCallExpression(child)) {
        const dependency = extractEmberGetDependencies(child, importedNames);

        if (dependency.length > 0) {
          results.push(child);
        }
      }
    },
    fallback: 'iteration',
  });

  return results;
}

/**
 * Recursively finds all `this.property` usages.
 *
 * @param {ASTNode} node
 * @returns {Array<ASTNode>}
 */
function findThisGetCalls(node) {
  const results = [];

  estraverse.traverse(node, {
    enter(child, parent) {
      if (
        (types.isOptionalMemberExpression(child) || types.isMemberExpression(child)) &&
        !(
          (types.isCallExpression(parent) || types.isOptionalCallExpression(parent)) &&
          parent.callee === child
        ) &&
        !utils.isInLeftSideOfAssignmentExpression(child) && // Ignore the left side (x) of an assignment: this.x = 123;
        propertyGetterUtils.isSimpleThisExpression(child)
      ) {
        results.push(child);
      }
    },
    fallback: 'iteration',
  });

  return results;
}

/**
 * Get an array argument's elements or the rest params if the values were not
 * passed as a single array argument.
 *
 * @param {Array<ASTNode>} args
 * @returns {Array<ASTNode>}
 */
function getArrayOrRest(args) {
  if (args.length === 1 && types.isArrayExpression(args[0])) {
    return args[0].elements;
  }
  return args;
}

/**
 * Extracts all static property keys used in the various forms of `Ember.get`.
 *
 * @param {ASTNode} call
 * @param {object} importedNames
 * @returns {Array<string>}
 */
function extractEmberGetDependencies(
  call,
  { importedEmberName, importedGetName, importedGetPropertiesName, importedGetWithDefaultName }
) {
  if (
    isMemberExpression(call.callee, 'this', 'get') ||
    isMemberExpression(call.callee, 'this', 'getWithDefault')
  ) {
    const firstArg = call.arguments[0];

    if (types.isStringLiteral(firstArg)) {
      return [firstArg.value];
    }
  } else if (
    isMemberExpression(call.callee, importedEmberName, 'get') ||
    isMemberExpression(call.callee, importedEmberName, 'getWithDefault') ||
    isIdentifier(call.callee, importedGetName) ||
    isIdentifier(call.callee, importedGetWithDefaultName)
  ) {
    const firstArg = call.arguments[0];
    const secondArgument = call.arguments[1];

    if (types.isThisExpression(firstArg) && types.isStringLiteral(secondArgument)) {
      return [secondArgument.value];
    }
  } else if (isMemberExpression(call.callee, 'this', 'getProperties')) {
    return getArrayOrRest(call.arguments)
      .filter(types.isStringLiteral)
      .map((arg) => arg.value);
  } else if (
    isMemberExpression(call.callee, importedEmberName, 'getProperties') ||
    isIdentifier(call.callee, importedGetPropertiesName)
  ) {
    const firstArg = call.arguments[0];
    const rest = call.arguments.slice(1);

    if (types.isThisExpression(firstArg)) {
      return getArrayOrRest(rest)
        .filter(types.isStringLiteral)
        .map((arg) => arg.value);
    }
  }

  return [];
}

function extractThisGetDependencies(memberExpression, context) {
  return propertyGetterUtils.nodeToDependentKey(memberExpression, context);
}

function removeRedundantKeys(keys) {
  return keys.filter(
    (currentKey) => !computedPropertyDependentKeyUtils.keyExistsAsPrefixInList(keys, currentKey)
  );
}

function removeServiceNames(keys, serviceNames) {
  if (!serviceNames || serviceNames.length === 0) {
    return keys;
  }
  return keys.filter((key) => !serviceNames.includes(key));
}

const ERROR_MESSAGE_NON_STRING_VALUE = 'Non-string value used as computed property dependency';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require dependencies to be declared statically in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-computed-property-dependencies.md',
    },

    fixable: 'code',

    schema: [
      {
        type: 'object',
        properties: {
          allowDynamicKeys: {
            type: 'boolean',
            default: true,
            description:
              'Whether the rule should allow or disallow dynamic (variable / non-string) dependency keys in computed properties.',
          },
          requireServiceNames: {
            type: 'boolean',
            default: false,
            description:
              'Whether the rule should require injected service names to be listed as dependency keys in computed properties.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  ERROR_MESSAGE_NON_STRING_VALUE,

  create(context) {
    // Options:
    const requireServiceNames = context.options[0] && context.options[0].requireServiceNames;
    const allowDynamicKeys = !context.options[0] || context.options[0].allowDynamicKeys;

    const serviceNames = [];

    let importedEmberName;
    let importedComputedName;
    let importedGetName;
    let importedGetPropertiesName;
    let importedGetWithDefaultName;
    let importedInjectName;

    function checkComputedDependencies(node, nodeArguments, importedNames) {
      const declaredDependencies = parseComputedDependencies(nodeArguments);

      if (!allowDynamicKeys) {
        for (const key of declaredDependencies.dynamicKeys) {
          context.report({
            node: key,
            message: ERROR_MESSAGE_NON_STRING_VALUE,
          });
        }
      }

      const computedPropertyFunctionBody =
        computedPropertyUtils.getComputedPropertyFunctionBody(node);

      const usedKeys1 = findEmberGetCalls(computedPropertyFunctionBody, importedNames).flatMap(
        (node) => extractEmberGetDependencies(node, importedNames)
      );

      const usedKeys2 = findThisGetCalls(computedPropertyFunctionBody).flatMap((node) =>
        extractThisGetDependencies(node, context)
      );
      const usedKeys = [...usedKeys1, ...usedKeys2];

      const expandedDeclaredKeys = computedPropertyDependentKeyUtils.expandKeys(
        declaredDependencies.keys.map(nodeToStringValue)
      );

      const undeclaredKeysBeforeServiceCheck = removeRedundantKeys(
        usedKeys
          .filter((usedKey) =>
            expandedDeclaredKeys.every(
              (declaredKey) =>
                declaredKey !== usedKey &&
                !computedPropertyDependentKeyUtils.computedPropertyDependencyMatchesKeyPath(
                  declaredKey,
                  usedKey
                )
            )
          )
          .reduce((keys, key) => {
            if (!keys.includes(key)) {
              keys.push(key);
            }
            return keys;
          }, [])
          .sort()
      );

      const undeclaredKeys = requireServiceNames
        ? undeclaredKeysBeforeServiceCheck
        : removeServiceNames(undeclaredKeysBeforeServiceCheck, serviceNames);

      if (undeclaredKeys.length > 0) {
        context.report({
          node,
          message: 'Use of undeclared dependencies in computed property: {{undeclaredKeys}}',
          data: { undeclaredKeys: undeclaredKeys.join(', ') },
          fix(fixer) {
            const sourceCode = context.getSourceCode();

            const missingDependenciesAsArgumentsForDynamicKeys =
              declaredDependencies.dynamicKeys.map((dynamicKey) => sourceCode.getText(dynamicKey));
            const missingDependenciesAsArgumentsForStringKeys =
              computedPropertyDependentKeyUtils.collapseKeys(
                removeRedundantKeys([...undeclaredKeys, ...expandedDeclaredKeys])
              );

            const missingDependenciesAsArguments = [
              ...missingDependenciesAsArgumentsForDynamicKeys,
              ...missingDependenciesAsArgumentsForStringKeys,
            ].join(', ');

            if (nodeArguments.length > 0) {
              const lastArg = node.arguments.at(-1);
              if (computedPropertyUtils.isComputedPropertyBodyArg(lastArg)) {
                if (node.arguments.length > 1) {
                  const firstDependency = node.arguments[0];
                  const lastDependency = node.arguments.at(-2);

                  // Replace the dependent keys before the function body argument.
                  // Before: computed('first', function() {})
                  // After: computed('first', 'last', function() {})
                  return fixer.replaceTextRange(
                    [firstDependency.range[0], lastDependency.range[1]],
                    missingDependenciesAsArguments
                  );
                } else {
                  // Add dependent keys before the function body argument.
                  // Before: computed(function() {})
                  // After: computed('key', function() {})
                  return fixer.insertTextBefore(lastArg, `${missingDependenciesAsArguments}, `);
                }
              } else {
                // All arguments are dependent keys, so replace them all.
                // Before: @computed('first')
                // After: @computed('first', 'last')
                const firstDependency = nodeArguments[0];
                const lastDependency = lastArg;
                return fixer.replaceTextRange(
                  [firstDependency.range[0], lastDependency.range[1]],
                  missingDependenciesAsArguments
                );
              }
            } else {
              const nodeText = sourceCode.getText(node);
              if (types.isCallExpression(node)) {
                // Insert dependencies inside empty parenthesis.
                // Before: @computed()
                // After: @computed('first')
                const positionAfterParenthesis = node.range[0] + nodeText.indexOf('(') + 1;
                return fixer.insertTextAfterRange(
                  [node.range[0], positionAfterParenthesis],
                  missingDependenciesAsArguments
                );
              } else {
                // Add dependencies with parentheses.
                // Before: @computed
                // After: @computed('first')
                return fixer.insertTextAfterRange(
                  [node.range[0], node.range[0] + nodeText.length],
                  `(${missingDependenciesAsArguments})`
                );
              }
            }
          },
        });
      }
    }

    function collectServiceNames(node) {
      // If service names aren't required dependencies, then we need to keep track of them so that we can ignore them.
      if (
        !requireServiceNames &&
        emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName)
      ) {
        if (types.isIdentifier(node.key)) {
          serviceNames.push(node.key.name);
        } else if (types.isStringLiteral(node.key)) {
          serviceNames.push(node.key.value);
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
          importedGetPropertiesName =
            importedGetPropertiesName ||
            getImportIdentifier(node, '@ember/object', 'getProperties');
          importedGetWithDefaultName =
            importedGetWithDefaultName ||
            getImportIdentifier(node, '@ember/object', 'getWithDefault');
        }
        if (node.source.value === '@ember/service') {
          importedInjectName =
            importedInjectName ||
            getImportIdentifier(node, '@ember/service', 'inject') ||
            getImportIdentifier(node, '@ember/service', 'service');
        }
      },

      Identifier(node) {
        if (emberUtils.isComputedProp(node, importedEmberName, importedComputedName)) {
          checkComputedDependencies(node, [], {
            importedEmberName,
            importedGetName,
            importedGetPropertiesName,
            importedGetWithDefaultName,
          });
        }
      },

      CallExpression(node) {
        if (emberUtils.isComputedProp(node, importedEmberName, importedComputedName)) {
          checkComputedDependencies(node, node.arguments, {
            importedEmberName,
            importedGetName,
            importedGetPropertiesName,
            importedGetWithDefaultName,
          });
        }
      },

      ClassBody(node) {
        for (const bodyNode of node.body) {
          collectServiceNames(bodyNode);
        }
      },

      ObjectExpression(node) {
        for (const property of node.properties) {
          collectServiceNames(property);
        }
      },
    };
  },
};
