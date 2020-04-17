'use strict';

const javascriptUtils = require('./javascript');

module.exports = {
  collapseKeys,
  expandKeys,
  expandKey,
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
      .map((expanded) => expanded.join('.')); // ["foo.bar", "foo.baz"]
  } else {
    // No braces.
    // Example: "hello.world"
    return key;
  }
}
