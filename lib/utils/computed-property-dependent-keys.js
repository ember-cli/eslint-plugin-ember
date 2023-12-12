'use strict';

const javascriptUtils = require('./javascript');
const { getName } = require('../utils/utils');
const types = require('../utils/types');
const decoratorUtils = require('../utils/decorators');
const assert = require('assert');
const { getMacrosFromImports } = require('../utils/computed-property-macros');

module.exports = {
  collapseKeys,
  expandKeys,
  expandKey,
  findComputedPropertyDependentKeys,
  getComputedPropertyDependentKeys,
  computedPropertyDependencyMatchesKeyPath,
  keyExistsAsPrefixInList,
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
  return keys.flatMap(expandKey);
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
    const keyAfterCurlySplitByCommas = keyAfterCurly.replaceAll(/{|}/g, '').split(','); // ["bar", "baz"]
    const keyRecombined = [[keyBeforeCurly], keyAfterCurlySplitByCommas]; // [["foo"], ["baz", "baz"]]
    return keyRecombined
      .reduce(
        (acc, nextParts) =>
          // iteration 1 (["foo"]): do nothing (duplicate 0 times), resulting in acc === [["foo"]]
          // iteration 2 (["bar", "baz"]): duplicate acc once, resulting in `[["foo"], ["foo"]]
          javascriptUtils.duplicateArrays(acc, nextParts.length - 1).map(
            (base, index) =>
              // evenly distribute the parts across the repeated base keys.
              // nextParts[0 % 2] => "bar"
              // nextParts[1 % 2] => "baz"
              base.concat(nextParts[index % nextParts.length]) // eslint-disable-line unicorn/prefer-spread
          ),
        [[]]
      ) // [["foo", "bar"], ["foo", "baz"]]
      .map((expanded) => expanded.filter((part) => part !== '').join('.')); // ["foo.bar", "foo.baz"]
  } else {
    // No braces.
    // Example: "hello.world"
    return key;
  }
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

/**
 * A configuration for determining what arguments of a computed macro should be used as dependency keys
 * @typedef {Object} ComputedMacroConfiguration
 * @property {Object} [strings] - the configuration for which string arguments should be used
 * @property {number} strings.startIndex - the first index to look for string arguments
 * @property {number} strings.count - how many arguments to look at, including the start index.
 * @property {Object} [objects] - the configuration for which object arguments' values should  be used
 * @property {Object} objects.index - the argument index to look for object values in
 * @property {Object} [objects.allowedKeys] - if present, indicates which keys should be looked at for getting values.
 */

/**
 * Gets the set of computed property dependency keys used inside a class.
 *
 * @param {Node} nodeClass - Node for the class
 * @param {string} [computedImportName] - The name by which computed from '@ember/object' as imported with.
 * @param {Map<String, ComputedMacroConfiguration>} - A mapping from the names by which computed macros were imported to the configuration for what keys they depend on
 * @param {Map<String, Map<String, ComputedMacroConfiguration>} - A mapping from the names by which a computed macro index was imported to a map from what properties it has to what their macro configurations are.
 * @returns {Set<string>} - set of dependent keys used inside the class
 */
function findComputedPropertyDependentKeys(
  nodeClass,
  computedImportName,
  macrosByName,
  macrosByIndexName
) {
  if (types.isClassDeclaration(nodeClass)) {
    // Native JS class.
    return new Set(
      nodeClass.body.body.flatMap((node) => {
        // Check for `computed` itself.
        const computedDecorator = decoratorUtils.findDecorator(node, computedImportName);
        if (computedDecorator) {
          return getComputedPropertyDependentKeys(computedDecorator.expression);
        }

        // Check for a computed macro.
        const macroConfigsByName = getMacrosFromImports(macrosByName, macrosByIndexName);
        const macroDecorator = decoratorUtils.findDecoratorByNameCallback(node, (decoratorName) =>
          macroConfigsByName.has(decoratorName)
        );
        if (macroDecorator) {
          return getComputedPropertyDependentKeys(
            macroDecorator.expression,
            macroConfigsByName.get(decoratorUtils.getDecoratorName(macroDecorator))
          );
        }

        return [];
      })
    );
  } else if (types.isCallExpression(nodeClass)) {
    // Classic class.
    return new Set(
      nodeClass.arguments.filter(types.isObjectExpression).flatMap((classObject) => {
        return classObject.properties.flatMap((node) => {
          if (types.isProperty(node)) {
            const name = getName(node.value);
            if (!name) {
              return [];
            }

            // Check for `computed` itself.
            if (name === computedImportName) {
              return getComputedPropertyDependentKeys(node.value);
            }

            // Check for a computed macro.
            const macroConfigsByName = getMacrosFromImports(macrosByName, macrosByIndexName);
            if (macroConfigsByName.has(name)) {
              return getComputedPropertyDependentKeys(node.value, macroConfigsByName.get(name));
            }
          }
          return [];
        });
      })
    );
  } else {
    assert(false, 'Unexpected node type for a class.');
  }

  return new Set();
}

/**
 * Returns an array of the dependency keys for a particular argument and index for a particular configuration.
 *
 * @param {Object} argument - the argument to a computed macro
 * @param {number} index - the index of this particular argument for the computed macro
 * @param {ComputedMacroConfiguration} config - the configuration indicating how dependent keys should be gotten from the argument
 * @returns {String[]} - the list of string dependent keys indicated by the configuration.
 */
function getComputedPropertyDependentKeysForConfig(argument, index, { strings, objects }) {
  if (strings) {
    const { startIndex, count } = strings;
    if (
      index >= startIndex &&
      index < startIndex + count &&
      argument.type === 'Literal' &&
      typeof argument.value === 'string'
    ) {
      return [argument.value];
    }
  }

  if (objects) {
    const { index: configIndex, keys: allowedKeys } = objects;

    if (index === configIndex && argument.type === 'ObjectExpression') {
      return argument.properties
        .filter(({ key }) => {
          if (!allowedKeys) {
            return true;
          }

          if (key.type === 'Identifier') {
            return allowedKeys.includes(key.name);
          } else if (key.type === 'Literal' && typeof key.value === 'string') {
            return allowedKeys.includes(key.value);
          } else {
            return false;
          }
        })
        .filter(
          (property) =>
            property.value.type === 'Literal' && typeof property.value.value === 'string'
        )
        .map((property) => property.value.value);
    }
  }

  return [];
}

/**
 * Gets the list of string dependent keys from a computed property.
 *
 * @param {Node} node - the computed property node
 * @param {ComputedMacroConfiguration} [computedDependenciesConfig=null] - the configuration indicating how dependent keys should be gotten from the node.
 *   If not present, all string arguments will be used.
 * @returns {String[]} - the list of string dependent keys from this computed property
 */
function getComputedPropertyDependentKeys(node, computedDependenciesConfig = null) {
  if (node.type === 'ChainExpression') {
    return getComputedPropertyDependentKeys(node.expression);
  }

  if (!node.arguments) {
    return [];
  }

  const baseKeys = node.arguments.flatMap((argument, index) => {
    if (!computedDependenciesConfig) {
      return argument.type === 'Literal' && typeof argument.value === 'string'
        ? [argument.value]
        : [];
    }

    return computedDependenciesConfig.argumentFormat.flatMap(({ strings, objects }) => {
      return getComputedPropertyDependentKeysForConfig(argument, index, { strings, objects });
    });
  });

  return expandKeys(baseKeys);
}
