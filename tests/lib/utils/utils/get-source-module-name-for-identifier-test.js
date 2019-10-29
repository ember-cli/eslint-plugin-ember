const { getSourceModuleNameForIdentifier } = require('../../../../lib/utils/utils');
const { FauxContext } = require('../../../helpers/faux-context');

test('when the identifier is not imported', () => {
  const context = new FauxContext(`
    Foo;
  `);

  const node = { name: 'Foo' };

  expect(getSourceModuleNameForIdentifier(context, node)).toEqual(undefined);
});

describe('when the identifier is imported', () => {
  test('as a default export', () => {
    const context = new FauxContext(`
      import Foo from 'bar';

      Foo;
    `);

    const node = { name: 'Foo' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('as a named export', () => {
    const context = new FauxContext(`
      import { Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('when aliasing a named export', () => {
    const context = new FauxContext(`
      import { SomeOtherThing as Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });
});
