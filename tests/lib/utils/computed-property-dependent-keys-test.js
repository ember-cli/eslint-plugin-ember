'use strict';

const cpdkUtils = require('../../../lib/utils/computed-property-dependent-keys');
const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');

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
    const macrosByImport = new Map([
      [
        'rejectBy',
        {
          argumentFormat: [
            {
              strings: {
                startIndex: 0,
                count: 1,
              },
            },
          ],
        },
      ],
      [
        't',
        {
          argumentFormat: [
            {
              objects: { index: 1, keys: ['foo', 'bar', 'baz'] },
            },
          ],
        },
      ],
    ]);

    const macrosByIndexImport = new Map([
      [
        'c',
        new Map([
          [
            'readOnly',
            {
              argumentFormat: [
                {
                  strings: {
                    startIndex: 0,
                    count: 1,
                  },
                },
              ],
            },
          ],
        ]),
      ],
      [
        'somethingElse',
        new Map([
          [
            'strange',
            {
              argumentFormat: [
                {
                  strings: {
                    startIndex: 1,
                    count: 2,
                  },
                },
                {
                  objects: {
                    index: 3,
                  },
                },
              ],
            },
          ],
        ]),
      ],
    ]);

    const classNode = babelESLintParse(`
      import { computed as c } from '@ember/object';
      import { rejectBy, t } from 'custom-macros/macros';
      import { somethingElse } from 'custom-macros';
      import Component from '@ember/component';

      class MyClass extends Component {
        @c('x') get myProp() {}
        @c('x', 'x') get myProp() {} // Intentional duplicate dependent key.
        @c() get myProp() {}
        @c.readOnly('y') get myProp() {}
        @c.notSpecified('z') get myProp() {}
        @rejectBy('chores', 'done', true) get myProp() {}
        @random() get myProp() {}
        @random('') get myProp() {}
        @random('z') get myProp() {}
        @computed('bad') get myProp() {} // Wrong name.
        @readOnly('bad') get myProp() {} // Wrong name.
        @t('ignored', { foo: 'kept', "bar": 'also-kept', unknown: 'not-kept' }) stringProp;
        @somethingElse.strange('ignored', 'yes', 'also-yes', { arbitrary: 'indeed' }) otherProp;
      }
    `).body[4];
    expect([
      ...cpdkUtils.findComputedPropertyDependentKeys(
        classNode,
        computedImportName,
        macrosByImport,
        macrosByIndexImport
      ),
    ]).toStrictEqual(['x', 'y', 'chores', 'kept', 'also-kept', 'yes', 'also-yes', 'indeed']);
  });

  it('returns the right result with classic class', () => {
    const computedImportName = 'c';
    const macrosByImport = new Map([
      [
        'rejectBy',
        {
          argumentFormat: [
            {
              strings: {
                startIndex: 0,
                count: 1,
              },
            },
          ],
        },
      ],
      [
        't',
        {
          argumentFormat: [
            {
              objects: { index: 1, keys: ['foo', 'bar', 'baz'] },
            },
          ],
        },
      ],
    ]);

    const macrosByIndexImport = new Map([
      [
        'c',
        new Map([
          [
            'readOnly',
            {
              argumentFormat: [
                {
                  strings: {
                    startIndex: 0,
                    count: 1,
                  },
                },
              ],
            },
          ],
        ]),
      ],
      [
        'somethingElse',
        new Map([
          [
            'strange',
            {
              argumentFormat: [
                {
                  strings: {
                    startIndex: 1,
                    count: 2,
                  },
                },
                {
                  objects: {
                    index: 3,
                  },
                },
              ],
            },
          ],
        ]),
      ],
    ]);

    const classNode = babelESLintParse(`
      import { computed as c } from '@ember/object';
      import { rejectBy, t } from 'custom-macros/macros';
      import { somethingElse } from 'custom-macros';
      import Component from '@ember/component';

      Component.extend({
        prop1: c('x'),
        prop2: c('x', 'x'), // Intentional duplicate dependent key.
        prop3: c(),
        prop5: c?.readOnly('y'), // Macro plus optional expression.
        prop4: c.notSpecified('z'),
        prop6: rejectBy('chores', 'done', true),
        prop7: random(),
        prop8: random(''),
        prop9: random('z'),
        prop10: computed('bad'), // Wrong name.
        prop11: readOnly('bad'), // Wrong name.
        prop12: t('ignored', { foo: 'kept', "bar": 'also-kept', unknown: 'not-kept' }),
        prop13: somethingElse.strange('ignored', 'yes', 'also-yes', { arbitrary: 'indeed' }),
      });
    `).body[4].expression;
    expect([
      ...cpdkUtils.findComputedPropertyDependentKeys(
        classNode,
        computedImportName,
        macrosByImport,
        macrosByIndexImport
      ),
    ]).toStrictEqual(['x', 'y', 'chores', 'kept', 'also-kept', 'yes', 'also-yes', 'indeed']);
  });
});
