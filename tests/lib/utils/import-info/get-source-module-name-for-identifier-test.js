const { getSourceModuleNameForIdentifier } = require('../../../../lib/utils/import-info');
const { FauxContext } = require('../../../helpers/faux-context');
const babelEslint = require('babel-eslint');

test('when the identifier is not imported', () => {
  const context = new FauxContext(`
    Foo;
  `);

  const node = { name: 'Foo', type: 'Identifier' };

  expect(getSourceModuleNameForIdentifier(context, node)).toEqual(undefined);
});

describe('when the identifier is imported', () => {
  test('as a default export', () => {
    const context = new FauxContext(`
      import Foo from 'bar';

      Foo;
    `);

    const node = { name: 'Foo', type: 'Identifier' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('as a named export', () => {
    const context = new FauxContext(`
      import { Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo', type: 'Identifier' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('when aliasing a named export', () => {
    const context = new FauxContext(`
      import { SomeOtherThing as Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo', type: 'Identifier' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('Model.extend', () => {
    const context = new FauxContext(`
      import Model from '@ember-data/model';

      Model.extend();
    `);

    const node = babelEslint.parse('Model.extend({})').body[0].expression.callee;

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('@ember-data/model');
  });

  test('DS.Model.extend', () => {
    const context = new FauxContext(`
      import DS from 'ember-data';

      DS.Model.extend();
    `);

    const node = babelEslint.parse('DS.Model.extend({})').body[0].expression.callee;

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('ember-data');
  });

  test('Some.Long.Chained.Path.extend', () => {
    const context = new FauxContext(`
      import Some from 'some-path';

      Some.Long.Chained.Path.extend();
    `);

    const node = babelEslint.parse('Some.Long.Chained.Path.extend({})').body[0].expression.callee;

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('some-path');
  });
});
