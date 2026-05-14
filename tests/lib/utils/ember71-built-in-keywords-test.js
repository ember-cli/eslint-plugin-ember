'use strict';

const {
  ember71BuiltInKeywordsForVersion,
  getEmber71BuiltInKeywords,
} = require('../../../lib/utils/ember71-built-in-keywords');

const EXPECTED_KEYWORDS = [
  'and',
  'array',
  'element',
  'eq',
  'fn',
  'gt',
  'gte',
  'hash',
  'lt',
  'lte',
  'neq',
  'not',
  'on',
  'or',
];

describe('ember71BuiltInKeywordsForVersion', () => {
  it('returns the 7.1 built-in keywords as readonly globals for ember-source >= 7.1.0', () => {
    const globals = ember71BuiltInKeywordsForVersion('7.1.0');

    expect(Object.keys(globals).sort()).toEqual(EXPECTED_KEYWORDS);

    for (const keyword of EXPECTED_KEYWORDS) {
      expect(globals[keyword]).toBe('readonly');
    }
  });

  it('returns the keywords for pre-release ember-source 7.1 builds (e.g. 7.1.0-beta.1)', () => {
    expect(Object.keys(ember71BuiltInKeywordsForVersion('7.1.0-beta.1')).sort()).toEqual(
      EXPECTED_KEYWORDS
    );
  });

  it('returns the keywords for ember-source > 7.1.0', () => {
    expect(Object.keys(ember71BuiltInKeywordsForVersion('8.0.0-beta.1')).sort()).toEqual(
      EXPECTED_KEYWORDS
    );
  });

  it('returns an empty object for ember-source < 7.1.0', () => {
    expect(ember71BuiltInKeywordsForVersion('7.0.5')).toEqual({});
    expect(ember71BuiltInKeywordsForVersion('6.4.0')).toEqual({});
  });

  it('returns an empty object for non-string input', () => {
    expect(ember71BuiltInKeywordsForVersion(undefined)).toEqual({});
    expect(ember71BuiltInKeywordsForVersion(null)).toEqual({});
  });
});

describe('getEmber71BuiltInKeywords', () => {
  it('returns an empty object when ember-source is not installed in this repo', () => {
    // eslint-plugin-ember does not depend on ember-source, so the require()
    // inside getEmber71BuiltInKeywords() throws and falls through to {}.
    expect(getEmber71BuiltInKeywords()).toEqual({});
  });
});
