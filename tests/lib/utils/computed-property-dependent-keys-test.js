'use strict';

const cpdkUtils = require('../../../lib/utils/computed-property-dependent-keys');

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
