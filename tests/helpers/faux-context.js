'use strict';

const babelEslint = require('babel-eslint');

/**
 * Builds a fake ESLint context object that's enough to satisfy the contract
 * expected by `getSourceModuleNameForIdentifier` and `isEmberCoreModule`
 */
class FauxContext {
  constructor(code, filename = '', report = () => {}) {
    const { ast } = babelEslint.parseForESLint(code);

    this.ast = ast;
    this.filename = filename;
    this.report = report;
  }

  /**
   * Does not build the full tree of "ancestors" for the identifier, but
   * we only care about the first one; the Program node
   */
  getAncestors() {
    return [this.ast];
  }

  getFilename() {
    return this.filename;
  }
}

module.exports = {
  FauxContext,
};
