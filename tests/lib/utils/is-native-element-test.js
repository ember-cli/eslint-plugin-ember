'use strict';

const { isNativeElement, ELEMENT_TAGS } = require('../../../lib/utils/is-native-element');

// Tests exercise the list-lookup path only. Scope-based shadowing is covered
// by the rule-level test suites (see tests/lib/rules/template-no-block-params-
// for-html-elements.js and siblings) because it requires a real ESLint
// SourceCode / scope manager that's only built up by the rule tester.

describe('isNativeElement — list-only behavior (no sourceCode)', () => {
  it('returns true for lowercase HTML tag names', () => {
    expect(isNativeElement({ tag: 'div' })).toBe(true);
    expect(isNativeElement({ tag: 'article' })).toBe(true);
    expect(isNativeElement({ tag: 'h1' })).toBe(true);
    expect(isNativeElement({ tag: 'button' })).toBe(true);
    expect(isNativeElement({ tag: 'form' })).toBe(true);
    expect(isNativeElement({ tag: 'section' })).toBe(true);
  });

  it('returns true for SVG tag names', () => {
    expect(isNativeElement({ tag: 'svg' })).toBe(true);
    expect(isNativeElement({ tag: 'circle' })).toBe(true);
    expect(isNativeElement({ tag: 'path' })).toBe(true);
  });

  it('returns true for MathML tag names', () => {
    expect(isNativeElement({ tag: 'mfrac' })).toBe(true);
    expect(isNativeElement({ tag: 'math' })).toBe(true);
  });

  it('returns false for PascalCase component tags', () => {
    expect(isNativeElement({ tag: 'Button' })).toBe(false);
    expect(isNativeElement({ tag: 'MyWidget' })).toBe(false);
    // Native-tag names in PascalCase — the core bug case.
    expect(isNativeElement({ tag: 'Article' })).toBe(false);
    expect(isNativeElement({ tag: 'Form' })).toBe(false);
    expect(isNativeElement({ tag: 'Main' })).toBe(false);
    expect(isNativeElement({ tag: 'Nav' })).toBe(false);
    expect(isNativeElement({ tag: 'Section' })).toBe(false);
    expect(isNativeElement({ tag: 'Table' })).toBe(false);
  });

  it('returns false for named-arg invocations', () => {
    expect(isNativeElement({ tag: '@heading' })).toBe(false);
    expect(isNativeElement({ tag: '@tag.foo' })).toBe(false);
  });

  it('returns false for this-path invocations', () => {
    expect(isNativeElement({ tag: 'this.myComponent' })).toBe(false);
    expect(isNativeElement({ tag: 'this.comp.sub' })).toBe(false);
  });

  it('returns false for dot-path invocations', () => {
    expect(isNativeElement({ tag: 'foo.bar' })).toBe(false);
    expect(isNativeElement({ tag: 'ns.widget' })).toBe(false);
  });

  it('returns false for named-block / namespaced invocations', () => {
    expect(isNativeElement({ tag: 'foo::bar' })).toBe(false);
    expect(isNativeElement({ tag: 'Foo::Bar' })).toBe(false);
  });

  it('returns false for custom elements (accepted false negative)', () => {
    // Custom elements aren't in the html-tags/svg-tags/mathml-tag-names
    // allowlists. They're treated as "not a native element" so downstream
    // rules skip them — matches the convention established in PR #2689.
    expect(isNativeElement({ tag: 'my-element' })).toBe(false);
    expect(isNativeElement({ tag: 'x-foo' })).toBe(false);
  });

  it('returns false for empty / missing / non-string tag', () => {
    expect(isNativeElement({ tag: '' })).toBe(false);
    expect(isNativeElement({ tag: undefined })).toBe(false);
    expect(isNativeElement({ tag: null })).toBe(false);
    expect(isNativeElement({ tag: 123 })).toBe(false);
    expect(isNativeElement({})).toBe(false);
    expect(isNativeElement()).toBe(false);
    expect(isNativeElement(null)).toBe(false);
  });
});

describe('ELEMENT_TAGS', () => {
  it('includes all HTML, SVG, and MathML tag names', () => {
    // Sanity check — if this ever drops below a reasonable size, one of the
    // underlying packages has changed contract.
    expect(ELEMENT_TAGS.size).toBeGreaterThan(200);
    expect(ELEMENT_TAGS.has('div')).toBe(true);
    expect(ELEMENT_TAGS.has('circle')).toBe(true);
    expect(ELEMENT_TAGS.has('mfrac')).toBe(true);
  });
});
