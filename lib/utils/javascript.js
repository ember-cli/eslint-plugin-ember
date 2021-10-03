'use strict';

module.exports = {
  duplicateArrays,
  flatMap,
  removeWhitespace,
};

/**
 * duplicateArrays([["a", "b"]], 2) -> [["a", "b"], ["a", "b"], ["a", "b"]]
 * @param {Array<Array>} arr
 * @param {number} times
 * @returns {Array<Array>}
 */
function duplicateArrays(arr, times) {
  const result = [];
  for (let i = 0; i <= times; i++) {
    result.push(...arr.map((a) => a.slice(0))); // eslint-disable-line unicorn/prefer-spread
  }
  return result;
}

/**
 * Builds an array by concatenating the results of a map.
 * TODO: switch to native JavaScript `flatMap` once Node 12 is the minimum version we need to support.
 *
 * @template T, U
 * @param {Array<T>} array
 * @param {function(T): Array<U>} callback
 * @returns {Array<U>}
 */
function flatMap(array, callback) {
  return array.reduce((result, item, index) => result.concat(callback(item, index)), []); // eslint-disable-line unicorn/prefer-spread
}

function removeWhitespace(str) {
  // Removes whitespace anywhere inside string.
  return str.replace(/\s/g, '');
}
