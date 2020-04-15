'use strict';

function getTraverser() {
  let traverser;
  try {
    // eslint-disable-next-line node/no-unpublished-require
    traverser = require('eslint/lib/shared/traverser'); // eslint >= 6
  } catch (error) {
    // eslint-disable-next-line node/no-unpublished-require, node/no-missing-require
    traverser = require('eslint/lib/util/traverser'); // eslint < 6
  }
  return traverser;
}

const Traverser = getTraverser();
const emberUtils = require('../utils/ember');
const computedPropertyUtils = require('../utils/computed-properties');
const types = require('../utils/types');
const propertyGetterUtils = require('../utils/property-getter');
const assert = require('assert');

/**
 * Checks whether the node is an identifier and optionally, its name.
 *
 * @param {ASTNode} node
 * @param {string=} name
 * @returns {boolean}
 */
function isIdentifier(node, name) {
  if (!types.isIdentifier(node)) {
    return false;
  }

  if (name) {
    return node.name === name;
  }

  return true;
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
  if (!objectName && !propertyName) {
    return node && types.isMemberExpression(node);
  }

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
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isEmberComputed(node) {
  return isIdentifier(node, 'computed') || isMemberExpression(node, 'Ember', 'computed');
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
 * Builds an array by concatenating the results of a map.
 *
 * @template T, U
 * @param {Array<T>} array
 * @param {function(T): Array<U>} callback
 * @returns {Array<U>}
 */
function flatMap(array, callback) {
  return array.reduce((result, item) => result.concat(callback(item)), []);
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

const ARRAY_PROPERTIES = new Set(['length', 'firstObject', 'lastObject']);

/**
 * Determines whether a computed property dependency matches a key path.
 *
 * @param {string} dependency
 * @param {string} keyPath
 * @returns {boolean}
 */
function computedPropertyDependencyMatchesKeyPath(dependency, keyPath) {
  const dependencyParts = dependency.split('.');
  const keyPathParts = keyPath.split('.');
  const minLength = Math.min(dependencyParts.length, keyPathParts.length);

  for (let i = 0; i < minLength; i++) {
    const dependencyPart = dependencyParts[i];
    const keyPathPart = keyPathParts[i];

    if (dependencyPart === keyPathPart) {
      continue;
    }

    // When dealing with arrays some keys encompass others. For example, `@each`
    // encompasses `[]` and `length` because any `@each` is triggered on any
    // array mutation as well as for some element property. `[]` is triggered
    // only on array mutation and so will always be triggered when `@each` is.
    // Similarly, `length` will always trigger if `[]` triggers and so is
    // encompassed by it.
    if (dependencyPart === '[]' || dependencyPart === '@each') {
      const subordinateProperties = new Set(ARRAY_PROPERTIES);

      if (dependencyPart === '@each') {
        subordinateProperties.add('[]');
      }

      return (
        !keyPathPart || (keyPathParts.length === i + 1 && subordinateProperties.has(keyPathPart))
      );
    }

    return false;
  }

  // len(foo.bar.baz) > len(foo.bar), and so matches.
  return dependencyParts.length > keyPathParts.length;
}

/**
 * Recursively finds all calls to `Ember#get`, whether like `Ember.get(this, …)`
 * or `this.get(…)`.
 *
 * @param {ASTNode} node
 * @returns {Array<ASTNode>}
 */
function findEmberGetCalls(node) {
  const results = [];

  new Traverser().traverse(node, {
    enter(child) {
      if (types.isCallExpression(child)) {
        const dependency = extractEmberGetDependencies(child);

        if (dependency.length > 0) {
          results.push(child);
        }
      }
    },
  });

  return results;
}

/**
 * Recursively finds the names of all injected services.
 *
 * In this example: `intl` would be one of the results:
 * `Component.extend({ intl: service() });`
 *
 * @param {ASTNode} node
 * @returns {Array<String>}
 */
function findInjectedServiceNames(node) {
  const results = [];

  new Traverser().traverse(node, {
    enter(child) {
      if (
        (types.isProperty(child) || types.isClassProperty(child)) &&
        emberUtils.isInjectedServiceProp(child) &&
        types.isIdentifier(child.key)
      ) {
        results.push(child.key.name);
      }
    },
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

  new Traverser().traverse(node, {
    enter(child, parent) {
      if (
        types.isMemberExpression(child) &&
        !(types.isCallExpression(parent) && parent.callee === child) &&
        !(types.isAssignmentExpression(child.parent) && child === parent.left) && // Ignore the left side (x) of an assignment: this.x = 123;
        propertyGetterUtils.isSimpleThisExpression(child)
      ) {
        results.push(child);
      }
    },
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
 * @returns {Array<string>}
 */
function extractEmberGetDependencies(call) {
  if (
    isMemberExpression(call.callee, 'this', 'get') ||
    isMemberExpression(call.callee, 'this', 'getWithDefault')
  ) {
    const firstArg = call.arguments[0];

    if (types.isStringLiteral(firstArg)) {
      return [firstArg.value];
    }
  } else if (
    isMemberExpression(call.callee, 'Ember', 'get') ||
    isMemberExpression(call.callee, 'Ember', 'getWithDefault')
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
  } else if (isMemberExpression(call.callee, 'Ember', 'getProperties')) {
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

/**
 * Checks if the `key` is a prefix of any item in `keys`.
 *
 * Example:
 *    `keys`: `['a', 'b.c']`
 *    `key`: `'b'`
 *    Result: `true`
 *
 * @param {String[]} keys - list of dependent keys
 * @param {String} key - dependent key
 * @returns boolean
 */
function keyExistsAsPrefixInList(keys, key) {
  return keys.some((currentKey) => computedPropertyDependencyMatchesKeyPath(currentKey, key));
}

function removeRedundantKeys(keys) {
  return keys.filter((currentKey) => !keyExistsAsPrefixInList(keys, currentKey));
}

function removeServiceNames(keys, serviceNames) {
  if (!serviceNames || serviceNames.length === 0) {
    return keys;
  }
  return keys.filter((key) => !serviceNames.includes(key));
}

const ERROR_MESSAGE_NON_STRING_VALUE = 'Non-string value used as computed property dependency';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require dependencies to be declared statically in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-computed-property-dependencies.md',
    },

    fixable: 'code',

    schema: [
      {
        type: 'object',
        properties: {
          allowDynamicKeys: {
            type: 'boolean',
            default: true,
          },
          requireServiceNames: {
            type: 'boolean',
            default: false,
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

    let serviceNames = [];

    return {
      Program(node) {
        // If service names aren't required dependencies, then we need to keep track of them so that we can ignore them.
        serviceNames = requireServiceNames ? [] : findInjectedServiceNames(node);
      },

      CallExpression(node) {
        if (isEmberComputed(node.callee)) {
          const declaredDependencies = parseComputedDependencies(node.arguments);

          if (!allowDynamicKeys) {
            declaredDependencies.dynamicKeys.forEach((key) => {
              context.report({
                node: key,
                message: ERROR_MESSAGE_NON_STRING_VALUE,
              });
            });
          }

          const computedPropertyFunctionBody = computedPropertyUtils.getComputedPropertyFunctionBody(
            node
          );

          const usedKeys1 = flatMap(
            findEmberGetCalls(computedPropertyFunctionBody),
            extractEmberGetDependencies
          );
          const usedKeys2 = flatMap(findThisGetCalls(computedPropertyFunctionBody), (node) => {
            return extractThisGetDependencies(node, context);
          });
          const usedKeys = [...usedKeys1, ...usedKeys2];

          const expandedDeclaredKeys = expandKeys(declaredDependencies.keys.map(nodeToStringValue));

          const undeclaredKeysBeforeServiceCheck = removeRedundantKeys(
            usedKeys
              .filter((usedKey) =>
                expandedDeclaredKeys.every(
                  (declaredKey) =>
                    declaredKey !== usedKey &&
                    !computedPropertyDependencyMatchesKeyPath(declaredKey, usedKey)
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

                const missingDependenciesAsArgumentsForDynamicKeys = declaredDependencies.dynamicKeys.map(
                  (dynamicKey) => sourceCode.getText(dynamicKey)
                );
                const missingDependenciesAsArgumentsForStringKeys = collapseKeys(
                  removeRedundantKeys([...undeclaredKeys, ...expandedDeclaredKeys])
                );

                const missingDependenciesAsArguments = [
                  ...missingDependenciesAsArgumentsForDynamicKeys,
                  ...missingDependenciesAsArgumentsForStringKeys,
                ].join(', ');

                if (node.arguments.length > 0) {
                  const lastArg = node.arguments[node.arguments.length - 1];
                  if (computedPropertyUtils.isComputedPropertyBodyArg(lastArg)) {
                    if (node.arguments.length > 1) {
                      const firstDependency = node.arguments[0];
                      const lastDependency = node.arguments[node.arguments.length - 2];

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
                    const firstDependency = node.arguments[0];
                    const lastDependency = lastArg;
                    return fixer.replaceTextRange(
                      [firstDependency.range[0], lastDependency.range[1]],
                      missingDependenciesAsArguments
                    );
                  }
                } else {
                  // Insert dependencies inside empty parenthesis.
                  // Before: @computed()
                  // After: @computed('first')
                  const nodeText = sourceCode.getText(node);
                  const positionAfterParenthesis = node.range[0] + nodeText.indexOf('(') + 1;
                  return fixer.insertTextAfterRange(
                    [node.range[0], positionAfterParenthesis],
                    missingDependenciesAsArguments
                  );
                }
              },
            });
          }
        }
      },
    };
  },
};

function isBare(key) {
  return !key.includes('.') || key.endsWith('[]');
}

/**
 * Collapse dependency keys with braces if possible.
 *
 * Example:
 * Input: ["foo.bar", "foo.baz", "quux.[]"]
 * Output: ["foo.{bar,baz}", "quux.[]"]
 *
 * @param {Array<string>} keys
 * @returns string
 */
function collapseKeys(keys) {
  const uniqueKeys = [...new Set(keys)];

  const bareKeys = uniqueKeys.filter(isBare);
  const rest = uniqueKeys.filter((key) => !isBare(key));

  const mapByParent = rest.reduce((mapByParent, key) => {
    const [head, ...rest] = key.split('.').reverse();
    const parent = rest.reverse().join('.');

    mapByParent.set(parent, mapByParent.get(parent) || []);
    mapByParent.get(parent).push(head);

    return mapByParent;
  }, new Map());

  const joined = [...mapByParent.keys()].map((parent) => {
    const children = mapByParent.get(parent);
    if (children.length > 1) {
      return `${parent}.{${children.sort().join(',')}}`;
    }
    return `${parent}.${children[0]}`;
  });

  return [...bareKeys, ...joined].sort().map((key) => `'${key}'`);
}

/**
 * ["foo.{bar,baz}", "quux"] => ["foo.bar", "foo.baz", "quux"]
 * @param {Array<string>} keys
 * @returns {Array<string>}
 */
function expandKeys(keys) {
  // aka flat map
  return [].concat(...keys.map(expandKey)); // eslint-disable-line unicorn/prefer-flat-map
}

/**
 * Expand any brace usage in a dependency key.
 *
 * Example:
 * Input: "foo.{bar,baz}"
 * Output: ["foo.bar", "foo.baz"]
 *
 * @param {string} key
 * @returns {Array<string>}
 */
function expandKey(key) {
  if (key.includes('{')) {
    // key = "foo.{bar,baz}"
    const keyParts = key.split('{'); // ["foo", "{bar,baz}"]
    const keyBeforeCurly = keyParts[0].slice(0, Math.max(0, keyParts[0].length - 1)); // "foo"
    const keyAfterCurly = keyParts[1]; // "{bar,baz}"
    const keyAfterCurlySplitByCommas = keyAfterCurly.replace(/{|}/g, '').split(','); // ["bar", "baz"]
    const keyRecombined = [[keyBeforeCurly], keyAfterCurlySplitByCommas]; // [["foo"], ["baz", "baz"]]
    return keyRecombined
      .reduce(
        (acc, nextParts) =>
          // iteration 1 (["foo"]): do nothing (duplicate 0 times), resulting in acc === [["foo"]]
          // iteration 2 (["bar", "baz"]): duplicate acc once, resulting in `[["foo"], ["foo"]]
          duplicateArrays(acc, nextParts.length - 1).map((base, index) =>
            // evenly distribute the parts across the repeated base keys.
            // nextParts[0 % 2] => "bar"
            // nextParts[1 % 2] => "baz"
            base.concat(nextParts[index % nextParts.length])
          ),
        [[]]
      ) // [["foo", "bar"], ["foo", "baz"]]
      .map((expanded) => expanded.join('.')); // ["foo.bar", "foo.baz"]
  } else {
    // No braces.
    // Example: "hello.world"
    return key;
  }
}

/**
 * duplicateArrays([["a", "b"]], 2) -> [["a", "b"], ["a", "b"], ["a", "b"]]
 * @param {Array<Array>} arr
 * @param {number} times
 * @returns {Array<Array>}
 */
function duplicateArrays(arr, times) {
  const result = [];
  for (let i = 0; i <= times; i++) {
    result.push(...arr.map((a) => a.slice(0)));
  }
  return result;
}
