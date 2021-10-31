const {
  getMacros,
  getMacrosFromImports,
  getTrackedArgumentCount,
  macroToCanonicalName,
} = require('../../../lib/utils/computed-property-macros');

describe('getMacros', () => {
  it('returns some of the correct macros', () => {
    expect(getMacros()).toStrictEqual(expect.arrayContaining(['and', 'readOnly']));
  });
});

describe('getMacrosFromImports', () => {
  it('returns some of the correct macros', () => {
    const macrosByImport = new Map([
      ['readOnlyRenamed', 'read-only-config'],
      ['aliasRenamed', 'alias-config'],
    ]);
    const macrosByIndexImport = new Map([
      [
        'computed',
        new Map([
          ['readOnly', 'read-only-config'],
          ['alias', 'alias-config'],
        ]),
      ],
      ['customComputed', new Map([['rejectBy', 'reject-by-config']])],
    ]);
    const result = [...getMacrosFromImports(macrosByImport, macrosByIndexImport)];
    expect(result).toStrictEqual(
      expect.arrayContaining([
        ['readOnlyRenamed', 'read-only-config'],
        ['aliasRenamed', 'alias-config'],
        ['computed.readOnly', 'read-only-config'],
        ['computed.alias', 'alias-config'],
        ['customComputed.rejectBy', 'reject-by-config'],
      ])
    );
  });
});

describe('getTrackedArgumentCount', () => {
  it('returns the correct number for some example macros', () => {
    expect(getTrackedArgumentCount('and')).toStrictEqual(Number.MAX_VALUE);
    expect(getTrackedArgumentCount('readOnly')).toBe(1);
  });
});

describe('macroToCanonicalName', () => {
  it('returns the correct canonical name for some example macros', () => {
    const macroImportNames = new Map([
      ['and', 'and'],
      ['readOnly', 'readOnlyRenamed'],
    ]);

    expect(macroToCanonicalName('and', macroImportNames)).toBe('and');
    expect(macroToCanonicalName('readOnlyRenamed', macroImportNames)).toBe('readOnly');

    expect(macroToCanonicalName('computed.readOnly', macroImportNames)).toBe('readOnly');
    expect(macroToCanonicalName('computedRenamed.readOnly', macroImportNames)).toBe('readOnly');
  });
});
