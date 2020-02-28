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
  const [program] = context.getAncestors(node);
  const importDeclaration = program.body
    .filter(isImportDeclaration)
    .find(importDeclaration =>
      importDeclaration.specifiers.some(
        specifier => specifier.local.name === getSourceModuleName(node)
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
 * @param {*} source the source, or module name string, of the import
 * @param {*} importName the imported name to find (will return the alias of the import, of found)
 * @returns
 */
function getImportIdentifier(node, source, importName) {
  assert(
    isImportDeclaration(node),
    `getImportIdentifier should be called with a node that's type is 'ImportDeclaration'. You passed '${node.type}'`
  );

  if (node.source.value !== source) {
    return '';
  }

  return node.specifiers
    .filter(specifier => {
      return (
        (specifier.type === 'ImportSpecifier' && specifier.imported.name === importName) ||
        (specifier.type === 'ImportDefaultSpecifier' && specifier.local.name === importName)
      );
    })
    .map(specifier => specifier.local.name)
    .pop();
}
