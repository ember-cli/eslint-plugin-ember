const assert = require('assert');

/**
 * Example macros:
 * - and('x', 'y', 'z') can have any number of tracked dependent key arguments
 * - mapBy('chores', 'done', true) only has a single tracked dependent key argument
 */
const MACROS_TO_TRACKED_ARGUMENT_COUNT = {
  alias: 1,
  and: Number.MAX_VALUE,
  bool: 1,
  collect: Number.MAX_VALUE,
  deprecatingAlias: 1,
  empty: 1,
  equal: 1,
  filter: 1,
  filterBy: 1,
  gt: 1,
  gte: 1,
  intersect: Number.MAX_VALUE,
  lt: 1,
  lte: 1,
  map: 1,
  mapBy: 1,
  match: 1,
  max: 1,
  min: 1,
  none: 1,
  not: 1,
  notEmpty: 1,
  oneWay: 1,
  or: Number.MAX_VALUE,
  readOnly: 1,
  reads: 1,
  setDiff: 2,
  sort: 1,
  sum: Number.MAX_VALUE,
  union: Number.MAX_VALUE,
  uniq: 1,
  uniqBy: 1,
};

// Configurations for the default macros that match the configurations for the
// no-assignment-of-untracked-properties-used-in-tracking-contexts rule
const DEFAULT_MACRO_CONFIGURATIONS = Object.entries(MACROS_TO_TRACKED_ARGUMENT_COUNT).map(
  ([macroName, argumentCount]) => ({
    name: macroName,
    path: '@ember/object/computed',
    indexName: 'computed',
    indexPath: '@ember/object',
    argumentFormat: [
      {
        strings: {
          startIndex: 0,
          count: argumentCount,
        },
      },
    ],
  })
);

/**
 * @returns {string[]} - a list of all macros.
 */
function getMacros() {
  return Object.keys(MACROS_TO_TRACKED_ARGUMENT_COUNT);
}

/**
 * Example of return value: ['and', 'readOnly', 'computed.and', 'computed.readOnly', ...]
 *
 * @param {string} computedImportName - name that computed is imported under
 * @param {set<string>} macroImportNames
 * @returns {set<string>} - a set containing all possible macro names to check for.
 */
function getMacrosFromImports(macrosByImport, macrosByIndexImport) {
  return new Map([
    ...macrosByImport,
    ...[...macrosByIndexImport].flatMap(([indexName, propertyConfigs]) => {
      return [...propertyConfigs].map(([name, config]) => [`${indexName}.${name}`, config]);
    }),
  ]);
}

/**
 * @param {string} macro
 * @returns {number} - the number arguments that are tracked dependent keys for a given macro.
 */
function getTrackedArgumentCount(macro) {
  assert(typeof macro === 'string', 'macro parameter should be a string');

  return MACROS_TO_TRACKED_ARGUMENT_COUNT[macro];
}

/**
 * @param {string} macro - imported macro name
 * @param {map<string,string>} macroImportNames
 * @returns {string} the original name of the imported macro
 */
function macroToCanonicalName(macro, macroImportNames) {
  assert(typeof macro === 'string', 'macro parameter should be a string');

  return macro.includes('.')
    ? macro.slice(macro.lastIndexOf('.') + 1) // Removes the leading `computed.`
    : [...macroImportNames.keys()].find(
        (canonicalName) => macroImportNames.get(canonicalName) === macro
      );
}

module.exports = {
  getMacros,
  getMacrosFromImports,
  getTrackedArgumentCount,
  macroToCanonicalName,
  DEFAULT_MACRO_CONFIGURATIONS,
  MACROS_TO_TRACKED_ARGUMENT_COUNT,
};
