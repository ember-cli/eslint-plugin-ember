const babelEslint = require('babel-eslint');
const importUtils = require('../../../lib/utils/import');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

describe('getSourceModuleName', () => {
  it('gets the correct module name with MemberExpression', () => {
    const node = parse('DS.Model.extend()').callee;
    expect(importUtils.getSourceModuleName(node)).toStrictEqual('DS');
  });

  it('gets the correct module name with Identifier', () => {
    const node = parse('Model.extend()').callee;
    expect(importUtils.getSourceModuleName(node)).toStrictEqual('Model');
  });

  it('gets the correct module name with CallExpression', () => {
    const node = parse('Model.extend()');
    expect(importUtils.getSourceModuleName(node)).toStrictEqual('Model');
  });
});

describe('getImportIdentifiers', () => {
  it('gets an empty array when no import is found', () => {
    const node = babelEslint.parse("import { later } from '@ember/runloop';").body[0];
    expect(importUtils.getImportIdentifiers(node, { '@ember/object': ['action'] })).toHaveLength(0);
  });

  it('gets an array of identifiers when found', () => {
    const node = babelEslint.parse("import { later } from '@ember/runloop';").body[0];
    const identifiers = importUtils.getImportIdentifiers(node, { '@ember/runloop': ['later'] });

    expect(identifiers).toHaveLength(1);
    expect(identifiers).toStrictEqual(['later']);
  });

  it('gets an array of aliased identifiers when found', () => {
    const node = babelEslint.parse("import { later as laterz } from '@ember/runloop';").body[0];
    const identifiers = importUtils.getImportIdentifiers(node, { '@ember/runloop': ['later'] });

    expect(identifiers).toHaveLength(1);
    expect(identifiers).toStrictEqual(['laterz']);
  });
});
