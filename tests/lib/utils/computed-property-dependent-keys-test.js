'use strict';

const cpdkUtils = require('../../../lib/utils/computed-property-dependent-keys');
const babelEslint = require('babel-eslint');

describe('collapseKeys', () => {
  it('returns the right result', () => {
    // No opportunity for braces
    expect(cpdkUtils.collapseKeys([])).toStrictEqual([]);
    expect(cpdkUtils.collapseKeys(['foo'])).toStrictEqual(["'foo'"]);
    expect(cpdkUtils.collapseKeys(['foo', 'bar'])).toStrictEqual(["'bar'", "'foo'"]);
    expect(cpdkUtils.collapseKeys(['foo.abc', 'bar.def'])).toStrictEqual([
      "'bar.def'",
      "'foo.abc'",
    ]);

    // Opportunity for braces
    expect(cpdkUtils.collapseKeys(['foo.abc', 'foo.def'])).toStrictEqual(["'foo.{abc,def}'"]);
  });
});

describe('expandKey', () => {
  it('returns the right result', () => {
    // No expansion possible
    expect(cpdkUtils.expandKey('')).toStrictEqual('');
    expect(cpdkUtils.expandKey('foo')).toStrictEqual('foo');
    expect(cpdkUtils.expandKey('foo.bar')).toStrictEqual('foo.bar');
    expect(cpdkUtils.expandKey('foo.{bar}')).toStrictEqual(['foo.bar']);

    // Expansion possible
    expect(cpdkUtils.expandKey('foo.{bar1,bar2}')).toStrictEqual(['foo.bar1', 'foo.bar2']);
    expect(cpdkUtils.expandKey('foo.@each.{bar1,bar2}')).toStrictEqual([
      'foo.@each.bar1',
      'foo.@each.bar2',
    ]);
    expect(cpdkUtils.expandKey('{foo,bar}')).toStrictEqual(['foo', 'bar']);
  });
});

describe('computedPropertyDependencyMatchesKeyPath', () => {
  it('returns the right result', () => {
    // False:
    expect(cpdkUtils.computedPropertyDependencyMatchesKeyPath('foo', 'bar')).toStrictEqual(false);
    expect(cpdkUtils.computedPropertyDependencyMatchesKeyPath('foo.bar', 'bar')).toStrictEqual(
      false
    );

    // True:
    expect(cpdkUtils.computedPropertyDependencyMatchesKeyPath('foo.bar', 'foo')).toStrictEqual(
      true
    );
    expect(
      cpdkUtils.computedPropertyDependencyMatchesKeyPath('foo.@each.bar', 'foo')
    ).toStrictEqual(true);
    expect(cpdkUtils.computedPropertyDependencyMatchesKeyPath('foo.[]', 'foo')).toStrictEqual(true);
    expect(
      cpdkUtils.computedPropertyDependencyMatchesKeyPath('foo.bar.xyz', 'foo.bar')
    ).toStrictEqual(true);
  });
});

describe('keyExistsAsPrefixInList', () => {
  it('returns the right result', () => {
    // False:
    expect(cpdkUtils.keyExistsAsPrefixInList(['a', 'b.c'], 'x')).toStrictEqual(false);
    expect(cpdkUtils.keyExistsAsPrefixInList(['a', 'b.c'], 'c')).toStrictEqual(false);

    // True:
    expect(cpdkUtils.keyExistsAsPrefixInList(['a', 'b.c'], 'b')).toStrictEqual(true);
  });
});

describe('findComputedPropertyDependentKeys', () => {
  it('returns the right result with native class', () => {
    const computedImportName = 'c';
    const macroImportNames = new Map([
      ['readOnly', 'readOnlyRenamed'],
      ['mapBy', 'mapBy'],
    ]);
    const classNode = babelEslint.parse(`
    import { computed as c } from '@ember/object';
    import { readOnly as readOnlyRenamed, mapBy } from '@ember/object/computed';
    import Component from '@ember/component';
    class MyClass extends Component {
      @c('x') get myProp() {}
      @c('x', 'x') get myProp() {} // Intentional duplicate dependent key.
      @c() get myProp() {}
      @readOnlyRenamed('y') get myProp() {}
      @c.readOnly('z') get myProp() {}
      @mapBy('chores', 'done', true) get myProp() {}
      @random() get myProp() {}
      @random('') get myProp() {}
      @random('z') get myProp() {}
      @computed('bad') get myProp() {} // Wrong name.
      @readOnly('bad') get myProp() {} // Wrong name.
    }`).body[3];
    expect([
      ...cpdkUtils.findComputedPropertyDependentKeys(
        classNode,
        computedImportName,
        macroImportNames
      ),
    ]).toStrictEqual(['x', 'y', 'z', 'chores']);
  });

  it('returns the right result with classic class', () => {
    const computedImportName = 'c';
    const macroImportNames = new Map([
      ['readOnly', 'readOnlyRenamed'],
      ['mapBy', 'mapBy'],
    ]);
    const classNode = babelEslint.parse(`
    import { computed as c } from '@ember/object';
    import { readOnly as readOnlyRenamed, mapBy } from '@ember/object/computed';
    import Component from '@ember/component';
    Component.extend({
      prop1: c('x'),
      prop2: c('x', 'x'), // Intentional duplicate dependent key.
      prop3: c(),
      prop4: readOnlyRenamed('y'),
      prop5: c?.readOnly('z'), // Macro plus optional expression.
      prop6: mapBy('chores', 'done', true),
      prop7: random(),
      prop8: random(''),
      prop9: random('z'),
      prop10: computed('bad'), // Wrong name.
      prop11: readOnly('bad'), // Wrong name.
    });`).body[3].expression;
    expect([
      ...cpdkUtils.findComputedPropertyDependentKeys(
        classNode,
        computedImportName,
        macroImportNames
      ),
    ]).toStrictEqual(['x', 'y', 'z', 'chores']);
  });
});
