const { isDefaultImport } = require('../../../../lib/utils/import-info');
const { FauxContext } = require('../../../helpers/faux-context');
const babelEslint = require('babel-eslint');

test('when the identifier is not imported', () => {
  const context = new FauxContext(`
    Foo;
  `);

  const node = { name: 'Foo', type: 'Identifier' };

  expect(isDefaultImport(context, node)).toEqual(false);
});

describe('when the identifier is imported', () => {
  test('as a default export', () => {
    const context = new FauxContext(`
      import Foo from 'bar';

      Foo;
    `);

    const node = { name: 'Foo', type: 'Identifier' };

    expect(isDefaultImport(context, node)).toEqual(true);
  });

  test('as a named export', () => {
    const context = new FauxContext(`
      import { Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo', type: 'Identifier' };

    expect(isDefaultImport(context, node)).toEqual(false);
  });

  test('when aliasing a named export', () => {
    const context = new FauxContext(`
      import { SomeOtherThing as Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo', type: 'Identifier' };

    expect(isDefaultImport(context, node)).toEqual(false);
  });

  test('Some.Long.Chained.Path.extend', () => {
    const context = new FauxContext(`
      import Some from 'some-path';

      Some.Long.Chained.Path.extend();
    `);

    const node = babelEslint.parse('Some.Long.Chained.Path.extend({})').body[0].expression.callee;

    expect(isDefaultImport(context, node)).toEqual(true);
  });
});
