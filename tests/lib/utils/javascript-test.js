'use strict';

const javascriptUtils = require('../../../lib/utils/javascript');

describe('duplicateArrays', () => {
  it('returns the right result', () => {
    expect(javascriptUtils.duplicateArrays([], 2)).toStrictEqual([]);
    expect(javascriptUtils.duplicateArrays(['abc'], 2)).toStrictEqual(['abc', 'abc', 'abc']);
    expect(javascriptUtils.duplicateArrays(['first', 'second'], 2)).toStrictEqual([
      'first',
      'second',
      'first',
      'second',
      'first',
      'second',
    ]);
  });
});

describe('removeWhitespace', () => {
  it('returns the right result', () => {
    expect(javascriptUtils.removeWhitespace('abcdef')).toBe('abcdef');
    expect(javascriptUtils.removeWhitespace('abc def')).toBe('abcdef');
    expect(javascriptUtils.removeWhitespace(' abc def ')).toBe('abcdef');
  });
});
