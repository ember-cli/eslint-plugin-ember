'use strict';

const assert = require('assert');
const {
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isMemberExpression,
} = require('../utils/types');

module.exports = {
  getSourceModuleNameForIdentifier,
  getSourceModuleName,
  getImportIdentifier,
};

/**
 * Gets the name of the module that an identifier was imported from,
 * if it was imported
 *
 * @param {Object} context the context of the ESLint rule
 * @param {node} node the Identifier to find an import for
 * @returns {string | undefined} The name of the module the identifier was imported from, if it was imported
 */
function getSourceModuleNameForIdentifier(context, node) {
  const sourceModuleName = getSourceModuleName(node);
  const [program] = context.getAncestors(node);
  const importDeclaration = program.body
    .filter(isImportDeclaration)
    .find((importDeclaration) =>
      importDeclaration.specifiers.some((specifier) => specifier.local.name === sourceModuleName)
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
