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
