const babelEslint = require('babel-eslint');
const importUtils = require('../../../lib/utils/import');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

describe('getSourceModuleName', () => {
  it('gets the correct module name DS', () => {
    const node = parse('DS.Model.extend()').callee;
    expect(importUtils.getSourceModuleName(node)).toEqual('DS');
  });

  it('gets the correct module name Model', () => {
    const node = parse('Model.extend()').callee;
    expect(importUtils.getSourceModuleName(node)).toEqual('Model');
  });
});
