'use strict';

const assert = require('assert');
const {
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isMemberExpression,
} = require('../utils/types');

module.exports = {
  gatherImports,
  getImportFromMap,
  getSourceModuleNameForIdentifier,
  getSourceModuleName,
  getImportIdentifier,
};

const IMPORTS_TO_GATHER = [
  ['ember'],
  ['@ember/object', 'computed'],
  ['@ember/object', 'get'],
  ['@ember/object', 'getProperties'],
  ['@ember/object', 'getWithDefault'],
];

/**
 * Gathers the names that common imports are imported under.
 * @param {map<string,string>} imports map of each imported path/function to the name its imported under
 * @returns {function} a visitor for ImportDeclaration nodes
 */
function gatherImports(imports) {
  return function (node) {
    IMPORTS_TO_GATHER.forEach((importToGather) => {
      const [path, namedImport] = importToGather;
      const key = getImportMapKey(path, namedImport);
      if (node.source.value === path) {
        imports.set(key, imports.get(key) || getImportIdentifier(node, path, namedImport));
      }
    });
  };
}

/**
 * Generates a key to use for the imports map.
 * @param {string} path
 * @param {string} namedImport
 * @returns {string} key to use for map
 */
function getImportMapKey(path, namedImport) {
  return `${path}|${namedImport}`;
}

/**
 * Gets the name that the path/function is imported under from the map.
 * @param {map<string,string>} map
 * @param {string} path
 * @param {string} namedImport
 * @returns {string}
 */
function getImportFromMap(map, path, namedImport) {
  return map.get(getImportMapKey(path, namedImport));
}

/**
 * Gets the name of the module that an identifier was imported from,
 * if it was imported
 *
 * @param {Object} context the context of the ESLint rule
 * @param {node} node the Identifier to find an import for
 * @returns {string | undefined} The name of the module the identifier was imported from, if it was imported
 */
function getSourceModuleNameForIdentifier(context, node) {
  const [program] = context.getAncestors(node);
  const importDeclaration = program.body
    .filter(isImportDeclaration)
    .find((importDeclaration) =>
      importDeclaration.specifiers.some(
        (specifier) => specifier.local.name === getSourceModuleName(node)
      )
    );

  return importDeclaration ? importDeclaration.source.value : undefined;
}

function getSourceModuleName(node) {
  if (isCallExpression(node) && node.callee) {
    return getSourceModuleName(node.callee);
  } else if (isMemberExpression(node) && node.object) {
    return getSourceModuleName(node.object);
  } else if (isIdentifier(node)) {
    return node.name;
  } else {
    assert(
      false,
      '`getSourceModuleName` should only be called on a `CallExpression`, `MemberExpression` or `Identifier`'
    );
    return undefined;
  }
}

/**
 * Gets an import identifier (either imported or local name) from the specified ImportDeclaration.
 *
 * @param {node} node the ImportDeclaration to find the import identifier for
 * @param {string} source the source, or module name string, of the import
 * @param {string} [namedImportIdentifier=null] the named import identifier to find (will return the alias of the import, of found)
 * @returns {null} if no import is found with that name
 */
function getImportIdentifier(node, source, namedImportIdentifier = null) {
  assert(
    isImportDeclaration(node),
    `getImportIdentifier should be called with a node that's type is 'ImportDeclaration'. You passed '${node.type}'`
  );

  if (node.source.value !== source) {
    return null;
  }

  return node.specifiers
    .filter((specifier) => {
      return (
        (specifier.type === 'ImportSpecifier' &&
          specifier.imported.name === namedImportIdentifier) ||
        (!namedImportIdentifier && specifier.type === 'ImportDefaultSpecifier')
      );
    })
    .map((specifier) => specifier.local.name)
    .pop();
}
