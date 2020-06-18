'use strict';

const javascriptUtils = require('./javascript');

module.exports = {
  collapseKeys,
  expandKeys,
  expandKey,
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
          javascriptUtils.duplicateArrays(acc, nextParts.length - 1).map((base, index) =>
            // evenly distribute the parts across the repeated base keys.
            // nextParts[0 % 2] => "bar"
            // nextParts[1 % 2] => "baz"
            base.concat(nextParts[index % nextParts.length])
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
