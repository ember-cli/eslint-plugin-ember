'use strict';

module.exports = {
  duplicateArrays,
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

function removeWhitespace(str) {
  // Removes whitespace anywhere inside string.
  return str.replaceAll(/\s/g, '');
}
