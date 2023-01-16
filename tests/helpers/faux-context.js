'use strict';

const { parseForESLint } = require('../helpers/babel-eslint-parser');
const { SourceCode } = require('eslint');
/**
 * Builds a fake ESLint context object that's enough to satisfy the contract
 * expected by `getSourceModuleNameForIdentifier` and `isEmberCoreModule`
 */
class FauxContext {
  constructor(code, filename = '', report = () => {}) {
    const { ast } = parseForESLint(code);

    this.ast = ast;
    this.filename = filename;
    this.report = report;
    this.code = code;
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

  getSourceCode() {
    return new SourceCode(this.code, this.ast);
  }
}

module.exports = {
  FauxContext,
};
