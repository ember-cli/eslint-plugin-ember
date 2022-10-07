'use strict';

const types = require('./types');

module.exports = {
  insertImportDeclaration,
  removeCommaSeparatedNode,
};

function removeCommaSeparatedNode(node, sourceCode, fixer) {
  const tokenBefore = sourceCode.getTokenBefore(node);
  const tokenAfter = sourceCode.getTokenAfter(node);

  const removeComma = types.isCommaToken(tokenAfter)
    ? fixer.remove(tokenAfter)
    : fixer.remove(tokenBefore);
  const removeNode = fixer.remove(node);

  return [removeComma, removeNode];
}

/**
 * Returns an ESLint fixing object that inserts an import declaration depending on the passed arguments
 *
 * @param {Object} sourceCode The ESLint source code object
 * @param {Object} fixer The ESLint fixer object which will be used to apply fixes.
 * @param {String} source The name of the package from where the methods/properties will be imported.
 * @param {String} specifier The name of the method/property that needs to be imported.
 * @param {String} defaultSpecifier The name of the default specifier that needs to be imported.
 * @returns {Object} ESLint fixing object
 */
function insertImportDeclaration(sourceCode, fixer, source, specifier, defaultSpecifier) {
  return fixer.insertTextBefore(
    sourceCode.ast,
    `import ${defaultSpecifier ? `${defaultSpecifier}, ` : ''}{ ${specifier} } from '${source}';\n`
  );
}
