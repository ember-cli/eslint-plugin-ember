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

describe('getImportIdentifier', () => {
  it('gets null when no import is found', () => {
    const node = babelEslint.parse("import { later } from '@ember/runloop';").body[0];
    expect(importUtils.getImportIdentifier(node, '@ember/object', 'action')).toBeNull();
  });

  it('gets an identifier when found', () => {
    const node = babelEslint.parse("import { later } from '@ember/runloop';").body[0];
    const identifier = importUtils.getImportIdentifier(node, '@ember/runloop', 'later');

    expect(identifier).toStrictEqual('later');
  });

  it('gets an aliased identifier when found', () => {
    const node = babelEslint.parse("import { later as laterz } from '@ember/runloop';").body[0];
    const identifier = importUtils.getImportIdentifier(node, '@ember/runloop', 'later');

    expect(identifier).toStrictEqual('laterz');
  });

  it('returns undefined when no default import is found', () => {
    const node = babelEslint.parse("import { later } from '@ember/runloop';").body[0];
    const identifier = importUtils.getImportIdentifier(node, '@ember/runloop');

    expect(identifier).toBeUndefined();
  });

  it('gets an identifier when found for default imports', () => {
    const node = babelEslint.parse("import Component from '@ember/component';").body[0];
    const identifier = importUtils.getImportIdentifier(node, '@ember/component');

    expect(identifier).toStrictEqual('Component');
  });

  it('gets an named identifier when found with mixed imports', () => {
    const node = babelEslint.parse("import { later } from '@ember/runloop';").body[0];
    const identifier = importUtils.getImportIdentifier(node, '@ember/runloop', 'later');

    expect(identifier).toStrictEqual('later');
  });

  it('gets a default identifier when found with mixed imports', () => {
    const node = babelEslint.parse("import Component from '@ember/component';").body[0];
    const identifier = importUtils.getImportIdentifier(node, '@ember/component');

    expect(identifier).toStrictEqual('Component');
  });
});
