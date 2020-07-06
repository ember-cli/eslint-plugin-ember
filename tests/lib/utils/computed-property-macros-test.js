const {
  getMacros,
  getMacrosFromImportNames,
  getTrackedArgumentCount,
  macroToCanonicalName,
} = require('../../../lib/utils/computed-property-macros');

describe('getMacros', () => {
  it('returns some of the correct macros', () => {
    expect(getMacros()).toStrictEqual(expect.arrayContaining(['and', 'readOnly']));
  });
});

describe('getMacrosFromImportNames', () => {
  it('returns some of the correct macros', () => {
    const result = [
      ...getMacrosFromImportNames('computedRenamed', new Map([['readOnly', 'readOnlyRenamed']])),
    ];
    expect(result).toStrictEqual(
      expect.arrayContaining(['computedRenamed.readOnly', 'readOnlyRenamed'])
    );
  });
});

describe('getTrackedArgumentCount', () => {
  it('returns the correct number for some example macros', () => {
    expect(getTrackedArgumentCount('and')).toStrictEqual(Number.MAX_VALUE);
    expect(getTrackedArgumentCount('readOnly')).toStrictEqual(1);
  });
});

describe('macroToCanonicalName', () => {
  it('returns the correct canonical name for some example macros', () => {
    const macroImportNames = new Map([
      ['and', 'and'],
      ['readOnly', 'readOnlyRenamed'],
    ]);

    expect(macroToCanonicalName('and', macroImportNames)).toStrictEqual('and');
    expect(macroToCanonicalName('readOnlyRenamed', macroImportNames)).toStrictEqual('readOnly');

    expect(macroToCanonicalName('computed.readOnly', macroImportNames)).toStrictEqual('readOnly');
    expect(macroToCanonicalName('computedRenamed.readOnly', macroImportNames)).toStrictEqual(
      'readOnly'
    );
  });
});
