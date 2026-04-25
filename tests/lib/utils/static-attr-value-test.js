'use strict';

const { getStaticAttrValue } = require('../../../lib/utils/static-attr-value');

describe('getStaticAttrValue', () => {
  it('returns empty string for null/undefined (valueless attribute)', () => {
    expect(getStaticAttrValue(null)).toBe('');
    expect(getStaticAttrValue(undefined)).toBe('');
  });

  it('returns chars for GlimmerTextNode', () => {
    expect(getStaticAttrValue({ type: 'GlimmerTextNode', chars: 'hello' })).toBe('hello');
    expect(getStaticAttrValue({ type: 'GlimmerTextNode', chars: '' })).toBe('');
  });

  it('unwraps GlimmerMustacheStatement with BooleanLiteral', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerBooleanLiteral', value: true },
      })
    ).toBe('true');
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerBooleanLiteral', value: false },
      })
    ).toBe('false');
  });

  it('unwraps GlimmerMustacheStatement with StringLiteral', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerStringLiteral', value: 'foo' },
      })
    ).toBe('foo');
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerStringLiteral', value: '' },
      })
    ).toBe('');
  });

  it('unwraps GlimmerMustacheStatement with NumberLiteral', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerNumberLiteral', value: -1 },
      })
    ).toBe('-1');
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerNumberLiteral', value: 0 },
      })
    ).toBe('0');
  });

  it('returns undefined for GlimmerMustacheStatement with a dynamic PathExpression', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerMustacheStatement',
        path: { type: 'GlimmerPathExpression', original: 'this.foo' },
      })
    ).toBeUndefined();
  });

  it('joins GlimmerConcatStatement with only static parts', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerConcatStatement',
        parts: [
          { type: 'GlimmerTextNode', chars: 'prefix-' },
          {
            type: 'GlimmerMustacheStatement',
            path: { type: 'GlimmerStringLiteral', value: 'mid' },
          },
          { type: 'GlimmerTextNode', chars: '-suffix' },
        ],
      })
    ).toBe('prefix-mid-suffix');
  });

  it('joins concat with boolean and number literal parts', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerConcatStatement',
        parts: [
          {
            type: 'GlimmerMustacheStatement',
            path: { type: 'GlimmerBooleanLiteral', value: true },
          },
        ],
      })
    ).toBe('true');
    expect(
      getStaticAttrValue({
        type: 'GlimmerConcatStatement',
        parts: [
          {
            type: 'GlimmerMustacheStatement',
            path: { type: 'GlimmerNumberLiteral', value: -1 },
          },
        ],
      })
    ).toBe('-1');
  });

  it('returns undefined for GlimmerConcatStatement with a dynamic part', () => {
    expect(
      getStaticAttrValue({
        type: 'GlimmerConcatStatement',
        parts: [
          { type: 'GlimmerTextNode', chars: 'x-' },
          {
            type: 'GlimmerMustacheStatement',
            path: { type: 'GlimmerPathExpression', original: 'this.foo' },
          },
        ],
      })
    ).toBeUndefined();
  });

  it('returns undefined for an unknown node type', () => {
    expect(getStaticAttrValue({ type: 'GlimmerSubExpression' })).toBeUndefined();
  });
});
