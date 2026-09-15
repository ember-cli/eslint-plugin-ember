'use strict';

const { classifyAttribute, inferAttrKind } = require('../../../lib/utils/glimmer-attr-presence');

// Helpers to build minimal AttrNode-shaped objects for tests.
function attr(name, value) {
  return { name, value };
}
function textNode(chars) {
  return { type: 'GlimmerTextNode', chars };
}
function bareMustache(path) {
  return { type: 'GlimmerMustacheStatement', path };
}
function concat(parts) {
  return { type: 'GlimmerConcatStatement', parts };
}
const boolLit = (v) => ({ type: 'GlimmerBooleanLiteral', value: v });
const stringLit = (v) => ({ type: 'GlimmerStringLiteral', value: v });
const numberLit = (v) => ({ type: 'GlimmerNumberLiteral', value: v });
const nullLit = () => ({ type: 'GlimmerNullLiteral' });
const undefinedLit = () => ({ type: 'GlimmerUndefinedLiteral' });
const pathExpr = (original) => ({ type: 'GlimmerPathExpression', original });

describe('inferAttrKind', () => {
  it('classifies known HTML boolean attrs', () => {
    expect(inferAttrKind('disabled')).toBe('boolean');
    expect(inferAttrKind('muted')).toBe('boolean');
    expect(inferAttrKind('autoplay')).toBe('boolean');
    expect(inferAttrKind('hidden')).toBe('boolean');
    expect(inferAttrKind('controls')).toBe('boolean');
  });

  it('classifies aria-* attributes', () => {
    expect(inferAttrKind('aria-hidden')).toBe('aria');
    expect(inferAttrKind('aria-label')).toBe('aria');
    expect(inferAttrKind('aria-checked')).toBe('aria');
  });

  it('classifies known numeric attrs', () => {
    expect(inferAttrKind('tabindex')).toBe('numeric');
    expect(inferAttrKind('colspan')).toBe('numeric');
  });

  it('treats role as plain-string (not aria-coerced)', () => {
    // Despite living conceptually with ARIA, role is a plain DOM string
    // attribute and does NOT participate in falsy-coercion (per the
    // cross-attribute observations in docs/glimmer-attribute-behavior.md).
    expect(inferAttrKind('role')).toBe('plain-string');
  });

  it('classifies unknown attrs as plain-string', () => {
    expect(inferAttrKind('autocomplete')).toBe('plain-string');
    expect(inferAttrKind('href')).toBe('plain-string');
    expect(inferAttrKind('id')).toBe('plain-string');
    expect(inferAttrKind('for')).toBe('plain-string');
    expect(inferAttrKind('type')).toBe('plain-string');
  });

  it('is case-insensitive (HTML attribute names are case-insensitive)', () => {
    expect(inferAttrKind('Disabled')).toBe('boolean');
    expect(inferAttrKind('MUTED')).toBe('boolean');
    expect(inferAttrKind('TabIndex')).toBe('numeric');
    expect(inferAttrKind('ARIA-Hidden')).toBe('aria');
    expect(inferAttrKind('Aria-Label')).toBe('aria');
  });
});

describe('classifyAttribute', () => {
  describe('absent attribute', () => {
    it('returns absent for null/undefined attrNode', () => {
      expect(classifyAttribute(null)).toEqual({ presence: 'absent', value: null });
      expect(classifyAttribute(undefined)).toEqual({ presence: 'absent', value: null });
    });
  });

  describe('valueless attribute', () => {
    it('returns present with empty string (doc rows d1, h1)', () => {
      expect(classifyAttribute(attr('disabled', null))).toEqual({
        presence: 'present',
        value: '',
      });
      expect(classifyAttribute(attr('aria-hidden', undefined))).toEqual({
        presence: 'present',
        value: '',
      });
    });
  });

  describe('GlimmerTextNode (static text)', () => {
    it('returns present with literal chars (doc rows m1-m4, h2-h4, d1, i1)', () => {
      expect(classifyAttribute(attr('aria-hidden', textNode('true')))).toEqual({
        presence: 'present',
        value: 'true',
      });
      expect(classifyAttribute(attr('autocomplete', textNode('off')))).toEqual({
        presence: 'present',
        value: 'off',
      });
      expect(classifyAttribute(attr('muted', textNode('false')))).toEqual({
        presence: 'present',
        value: 'false',
      });
    });
  });

  describe('bare-mustache {{true}} / {{false}}', () => {
    it('{{false}} on boolean attr → absent (doc rows m6, d3)', () => {
      expect(classifyAttribute(attr('muted', bareMustache(boolLit(false))))).toEqual({
        presence: 'absent',
        value: null,
      });
      expect(classifyAttribute(attr('disabled', bareMustache(boolLit(false))))).toEqual({
        presence: 'absent',
        value: null,
      });
    });

    it('{{false}} on aria attr → absent (doc row h6)', () => {
      expect(classifyAttribute(attr('aria-hidden', bareMustache(boolLit(false))))).toEqual({
        presence: 'absent',
        value: null,
      });
    });

    it('{{false}} on numeric attr → absent (doc row t6)', () => {
      expect(classifyAttribute(attr('tabindex', bareMustache(boolLit(false))))).toEqual({
        presence: 'absent',
        value: null,
      });
    });

    it('{{false}} on plain-string attr → present "false" (doc row i4)', () => {
      expect(classifyAttribute(attr('autocomplete', bareMustache(boolLit(false))))).toEqual({
        presence: 'present',
        value: 'false',
      });
      // role is plain-string (not aria-coerced) — bare {{false}} renders literal
      expect(classifyAttribute(attr('role', bareMustache(boolLit(false))))).toEqual({
        presence: 'present',
        value: 'false',
      });
    });

    it('{{true}} on aria attr → present "" (doc row h5: renders aria-hidden="")', () => {
      expect(classifyAttribute(attr('aria-hidden', bareMustache(boolLit(true))))).toEqual({
        presence: 'present',
        value: '',
      });
    });

    it('{{true}} on boolean → present "true" (verified m5, d2)', () => {
      expect(classifyAttribute(attr('disabled', bareMustache(boolLit(true))))).toEqual({
        presence: 'present',
        value: 'true',
      });
      expect(classifyAttribute(attr('muted', bareMustache(boolLit(true))))).toEqual({
        presence: 'present',
        value: 'true',
      });
    });

    it('{{true}} on numeric / plain-string → unknown (untested in doc)', () => {
      expect(classifyAttribute(attr('tabindex', bareMustache(boolLit(true))))).toEqual({
        presence: 'unknown',
        value: null,
      });
      expect(classifyAttribute(attr('autocomplete', bareMustache(boolLit(true))))).toEqual({
        presence: 'unknown',
        value: null,
      });
    });
  });

  describe('bare-mustache {{null}} / {{undefined}}', () => {
    it('{{null}} on falsy-coerced kinds → absent (doc rows m9, d6, h9, t7)', () => {
      expect(classifyAttribute(attr('muted', bareMustache(nullLit())))).toEqual({
        presence: 'absent',
        value: null,
      });
      expect(classifyAttribute(attr('disabled', bareMustache(nullLit())))).toEqual({
        presence: 'absent',
        value: null,
      });
      expect(classifyAttribute(attr('aria-hidden', bareMustache(nullLit())))).toEqual({
        presence: 'absent',
        value: null,
      });
      expect(classifyAttribute(attr('tabindex', bareMustache(nullLit())))).toEqual({
        presence: 'absent',
        value: null,
      });
    });

    it('{{undefined}} on falsy-coerced kinds → absent (doc rows m10, h10)', () => {
      expect(classifyAttribute(attr('muted', bareMustache(undefinedLit())))).toEqual({
        presence: 'absent',
        value: null,
      });
      expect(classifyAttribute(attr('aria-hidden', bareMustache(undefinedLit())))).toEqual({
        presence: 'absent',
        value: null,
      });
    });

    it('{{null}} / {{undefined}} on plain-string → unknown (untested in doc)', () => {
      expect(classifyAttribute(attr('autocomplete', bareMustache(nullLit())))).toEqual({
        presence: 'unknown',
        value: null,
      });
      expect(classifyAttribute(attr('autocomplete', bareMustache(undefinedLit())))).toEqual({
        presence: 'unknown',
        value: null,
      });
    });
  });

  describe('bare-mustache string literal {{"x"}}', () => {
    it('renders the literal value across all kinds (doc rows m7, m8, h7, h8, d4, d5, i2)', () => {
      expect(classifyAttribute(attr('muted', bareMustache(stringLit('false'))))).toEqual({
        presence: 'present',
        value: 'false',
      });
      expect(classifyAttribute(attr('aria-hidden', bareMustache(stringLit('true'))))).toEqual({
        presence: 'present',
        value: 'true',
      });
      expect(classifyAttribute(attr('disabled', bareMustache(stringLit('false'))))).toEqual({
        presence: 'present',
        value: 'false',
      });
      expect(classifyAttribute(attr('autocomplete', bareMustache(stringLit('off'))))).toEqual({
        presence: 'present',
        value: 'off',
      });
    });

    it('handles empty string literal {{""}} as present empty', () => {
      // Doc row m11: <video muted={{""}}> renders <video muted=""></video>
      expect(classifyAttribute(attr('muted', bareMustache(stringLit(''))))).toEqual({
        presence: 'present',
        value: '',
      });
    });
  });

  describe('bare-mustache number literal {{0}} / {{N}}', () => {
    it('{{0}} on boolean attr → absent (doc row m12)', () => {
      expect(classifyAttribute(attr('muted', bareMustache(numberLit(0))))).toEqual({
        presence: 'absent',
        value: null,
      });
    });

    it('{{0}} on numeric attr → present "0" (doc row t1, focusable)', () => {
      expect(classifyAttribute(attr('tabindex', bareMustache(numberLit(0))))).toEqual({
        presence: 'present',
        value: '0',
      });
    });

    it('{{-1}} / {{1}} render as stringified value', () => {
      expect(classifyAttribute(attr('tabindex', bareMustache(numberLit(-1))))).toEqual({
        presence: 'present',
        value: '-1',
      });
      expect(classifyAttribute(attr('tabindex', bareMustache(numberLit(1))))).toEqual({
        presence: 'present',
        value: '1',
      });
    });
  });

  describe('bare-mustache dynamic path {{this.x}}', () => {
    it('on falsy-coerced kinds → unknown (could be falsy at runtime)', () => {
      expect(classifyAttribute(attr('muted', bareMustache(pathExpr('this.x'))))).toEqual({
        presence: 'unknown',
        value: null,
      });
      expect(classifyAttribute(attr('aria-hidden', bareMustache(pathExpr('this.x'))))).toEqual({
        presence: 'unknown',
        value: null,
      });
      expect(classifyAttribute(attr('tabindex', bareMustache(pathExpr('this.x'))))).toEqual({
        presence: 'unknown',
        value: null,
      });
    });

    it('on plain-string attr → present with unknown value', () => {
      expect(classifyAttribute(attr('autocomplete', bareMustache(pathExpr('this.x'))))).toEqual({
        presence: 'present',
        value: null,
      });
    });
  });

  describe('GlimmerConcatStatement (concat-mustache)', () => {
    it('"{{false}}" on boolean attr → present "true" (concat sets IDL true regardless; doc row m14)', () => {
      // Per doc m14, <video muted="{{false}}"> sets IDL muted=true.
      // Surface canonical "true" rather than the inner literal so callers
      // checking `value === 'false'` for "off" don't get the wrong answer.
      expect(classifyAttribute(attr('muted', concat([bareMustache(boolLit(false))])))).toEqual({
        presence: 'present',
        value: 'true',
      });
      expect(classifyAttribute(attr('disabled', concat([bareMustache(boolLit(false))])))).toEqual({
        presence: 'present',
        value: 'true',
      });
      expect(classifyAttribute(attr('muted', concat([bareMustache(stringLit('false'))])))).toEqual({
        presence: 'present',
        value: 'true',
      });
      expect(
        classifyAttribute(attr('muted', concat([textNode('x'), bareMustache(boolLit(false))])))
      ).toEqual({ presence: 'present', value: 'true' });
    });

    it('"{{false}}" on aria attr → present "false" (doc row h13, visible)', () => {
      expect(
        classifyAttribute(attr('aria-hidden', concat([bareMustache(boolLit(false))])))
      ).toEqual({ presence: 'present', value: 'false' });
    });

    it('"{{true}}" on aria attr → present "true" (doc row h12, hidden)', () => {
      expect(classifyAttribute(attr('aria-hidden', concat([bareMustache(boolLit(true))])))).toEqual(
        { presence: 'present', value: 'true' }
      );
    });

    it('"{{\'true\'}}" on aria → present "true" (doc row h14)', () => {
      expect(
        classifyAttribute(attr('aria-hidden', concat([bareMustache(stringLit('true'))])))
      ).toEqual({ presence: 'present', value: 'true' });
    });

    it('multi-part static concat resolves the joined string', () => {
      expect(
        classifyAttribute(
          attr(
            'aria-label',
            concat([textNode('prefix-'), bareMustache(stringLit('mid')), textNode('-suffix')])
          )
        )
      ).toEqual({ presence: 'present', value: 'prefix-mid-suffix' });
    });

    it('concat with dynamic part → present, value null', () => {
      expect(
        classifyAttribute(
          attr('aria-label', concat([textNode('prefix-'), bareMustache(pathExpr('this.x'))]))
        )
      ).toEqual({ presence: 'present', value: null });
    });
  });

  describe('options.kind override', () => {
    it('respects explicit kind over inferred', () => {
      // Force aria semantics on a non-aria-prefixed attribute name
      expect(
        classifyAttribute(attr('myCustomAttr', bareMustache(boolLit(false))), { kind: 'aria' })
      ).toEqual({ presence: 'absent', value: null });

      // Force plain-string on a known boolean attribute
      expect(
        classifyAttribute(attr('disabled', bareMustache(boolLit(false))), {
          kind: 'plain-string',
        })
      ).toEqual({ presence: 'present', value: 'false' });
    });
  });

  describe('unknown AST node type', () => {
    it('returns unknown for an unrecognized value type', () => {
      expect(classifyAttribute(attr('foo', { type: 'GlimmerSubExpression' }))).toEqual({
        presence: 'unknown',
        value: null,
      });
    });

    it('returns unknown when bare-mustache has no path', () => {
      expect(classifyAttribute(attr('foo', bareMustache(null)))).toEqual({
        presence: 'unknown',
        value: null,
      });
    });
  });
});
