const { getSourceModuleNameForIdentifier } = require('../../../../lib/utils/import');
const { FauxContext } = require('../../../helpers/faux-context');
const { parse: babelESLintParse } = require('../../../helpers/babel-eslint-parser');

describe('getSourceModuleNameForIdentifier', () => {
  describe('when the identifier is not imported', () => {
    it('returns undefined', () => {
      const context = new FauxContext(`
      Foo;
    `);

      const node = { name: 'Foo', type: 'Identifier' };

      expect(getSourceModuleNameForIdentifier(context, node)).toBeUndefined();
    });
  });

  describe('when the identifier is imported', () => {
    it('as a default export', () => {
      const context = new FauxContext(`
        import Foo from 'bar';

        Foo;
      `);

      const node = { name: 'Foo', type: 'Identifier' };

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('bar');
    });

    it('as a named export', () => {
      const context = new FauxContext(`
        import { Foo } from 'bar';

        Foo;
      `);

      const node = { name: 'Foo', type: 'Identifier' };

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('bar');
    });

    it('when aliasing a named export', () => {
      const context = new FauxContext(`
        import { SomeOtherThing as Foo } from 'bar';

        Foo;
      `);

      const node = { name: 'Foo', type: 'Identifier' };

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('bar');
    });

    it('model.extend', () => {
      const context = new FauxContext(`
        import Model from '@ember-data/model';

        Model.extend();
      `);

      const node = babelESLintParse('Model.extend({})').body[0].expression.callee;

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('@ember-data/model');
    });

    it('dS.Model.extend', () => {
      const context = new FauxContext(`
        import DS from 'ember-data';

        DS.Model.extend();
      `);

      const node = babelESLintParse('DS.Model.extend({})').body[0].expression.callee;

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('ember-data');
    });

    it('some.Long.Chained.Path.extend', () => {
      const context = new FauxContext(`
        import Some from 'some-path';

        Some.Long.Chained.Path.extend();
      `);

      const node = babelESLintParse('Some.Long.Chained.Path.extend({})').body[0].expression.callee;

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('some-path');
    });

    it('model.extend(Mixin)', () => {
      const context = new FauxContext(`
        import Mixin from './my-mixin';
        import Model from '@ember-data/model';

        export default class SomeClass extends Model.extend(Mixin) {}
      `);

      const node = babelESLintParse('Model.extend(Mixin)').body[0].expression;

      expect(getSourceModuleNameForIdentifier(context, node)).toStrictEqual('@ember-data/model');
    });
  });
});
