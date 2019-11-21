'use strict';

const { isImportDeclaration, isImportDefaultSpecifier } = require('./types');
const { getSourceModuleName } = require('./utils');

module.exports = {
  getSourceModuleNameForIdentifier,
  isDefaultImport,
};

/**
 * Gets the ImportDeclaration node that an identifier was imported from
 * if it was imported
 *
 * @param {Object} context the context of the ESLint rule
 * @param {node} node the Idenfifier to find an import for
 * @returns {ImportDeclaration | undefined} The ImportDeclaration of the module the identifier was imported from, if it was imported
 */
function getImportDeclarationNode(context, node) {
  const [program] = context.getAncestors(node);

  return program.body
    .filter(isImportDeclaration)
    .find(importDeclaration =>
      importDeclaration.specifiers.some(
        specifier => specifier.local.name === getSourceModuleName(node)
      )
    );
}

function getImportSpecifierNode(context, node) {
  const importDeclaration = getImportDeclarationNode(context, node);

  return importDeclaration
    ? importDeclaration.specifiers.find(
        specifier => specifier.local.name === getSourceModuleName(node)
      )
    : undefined;
}

/**
 * Gets the name of the module that an identifier was imported from,
 * if it was imported
 *
 * @param {Object} context the context of the ESLint rule
 * @param {node} node the Idenfifier to find an import for
 * @returns {string | undefined} The name of the module the identifier was imported from, if it was imported
 */
function getSourceModuleNameForIdentifier(context, node) {
  const importDeclaration = getImportDeclarationNode(context, node);

  return importDeclaration ? importDeclaration.source.value : undefined;
}

/**
 * Determines whether the given Identifer was the default import from some module
 *
 * @param {Object} context the context of the ESLint rule
 * @param {node} node the Idenfifier to check
 * @returns {boolean} Whether or not the identifier is a default import from a module
 */
function isDefaultImport(context, node) {
  const importSpecifier = getImportSpecifierNode(context, node);

  return isImportDefaultSpecifier(importSpecifier);
}
