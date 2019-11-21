'use strict';

const { isImportDeclaration } = require('./types');
const { getSourceModuleName } = require('./utils');

module.exports = {
  getSourceModuleNameForIdentifier,
};

/**
 * Gets the name of the module that an identifier was imported from,
 * if it was imported
 *
 * @param {Object} context the context of the ESLint rule
 * @param {node} node the Idenfifier to find an import for
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
