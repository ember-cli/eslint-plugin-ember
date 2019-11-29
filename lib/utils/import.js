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
