'use strict';

const rule = require('../../../lib/rules/template-anchor-has-content');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-anchor-has-content', rule, {
  valid: [
    // Text content — the baseline accessible name.
    { filename: 'test.gjs', code: '<template><a href="/x">link text</a></template>' },

    // Nested element with static text — the span's text surfaces as the name.
    { filename: 'test.gjs', code: '<template><a href="/x"><span>inner</span></a></template>' },

    // Explicit accessible-name attributes on the anchor itself.
    { filename: 'test.gjs', code: '<template><a href="/x" aria-label="Close" /></template>' },
    { filename: 'test.gjs', code: '<template><a href="/x" aria-labelledby="lbl" /></template>' },
    { filename: 'test.gjs', code: '<template><a href="/x" title="Open" /></template>' },

    // Dynamic accessible-name attribute — opaque, trust the author.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-label={{@label}} /></template>',
    },

    // Dynamic content — opaque at lint time, skip.
    { filename: 'test.gjs', code: '<template><a href="/x">{{@label}}</a></template>' },
    { filename: 'test.gjs', code: '<template><a href="/x">{{this.label}}</a></template>' },
    { filename: 'test.gjs', code: '<template><a href="/x">{{foo.bar}}</a></template>' },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x">{{#if ok}}Continue{{else}}Start{{/if}}</a></template>',
    },

    // <img alt="…"> contributes its alt to the accessible name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img alt="Search" /></a></template>',
    },

    // <img alt={{…}}> — dynamic alt, trust the author.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img alt={{@alt}} /></a></template>',
    },

    // <img alt={{"…"}}> — static string in mustache; non-empty alt counts as
    // accessible content.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img alt={{"Search"}} /></a></template>',
    },

    // aria-label with a non-empty mustache string literal is a valid name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-label={{"Close"}} /></template>',
    },

    // Component invocation (PascalCase) — not a plain HTML anchor, out of scope.
    { filename: 'test.gjs', code: '<template><Link href="/x" /></template>' },

    // Nested component child inside a plain <a> — opaque, skip.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><MyIcon /></a></template>',
    },

    // Anchor without href — out of scope (handled by template-link-href-attributes).
    { filename: 'test.gjs', code: '<template><a /></template>' },
    { filename: 'test.gjs', code: '<template><a>Foo</a></template>' },

    // Label on a nested element (via aria-label on the child).
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span aria-label="close icon" /></a></template>',
    },

    // Valueless / empty aria-hidden resolves to default `undefined` per
    // WAI-ARIA 1.2 §6.6 — the child is NOT hidden, its content counts.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span aria-hidden>X</span></a></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span aria-hidden="">X</span></a></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img aria-hidden alt="Nope" /></a></template>',
    },

    // Anchor itself hidden via HTML `hidden` boolean attribute — element is
    // not rendered, so "accessible name of an anchor" is moot.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" hidden /></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" hidden></a></template>',
    },

    // Anchor itself hidden via aria-hidden="true" — removed from the a11y
    // tree, so the accessible-name check does not apply.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-hidden="true" /></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-hidden={{true}}></a></template>',
    },
    // aria-hidden={{"true"}} — string-literal mustache, resolved statically to
    // "true"; anchor is hidden from the a11y tree, check does not apply.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-hidden={{"true"}} /></template>',
    },

    // Scope-shadowed lowercase `a` (local binding in GJS) — not the native
    // HTML anchor, so the rule does not validate it. `isNativeElement`
    // detects the shadowing via scope bindings in the scope chain.
    {
      filename: 'test.gjs',
      code: `
        const a = '';
        <template>
          <a href="/x" />
        </template>
      `,
    },
  ],

  invalid: [
    // Self-closing anchor with href — no content, no accessible name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" /></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // hidden={{false}} is the bare-mustache boolean-false case — Glimmer omits
    // the attribute at runtime (per docs/glimmer-attribute-behavior.md), so
    // the anchor is rendered and visible; an empty body still needs a name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" hidden={{false}}></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // Empty anchor.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // Whitespace-only content.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x">   </a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // aria-hidden="true" subtree contributes nothing to the accessible name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span aria-hidden="true">X</span></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // <img aria-hidden="true" alt="Nope" /> — alt not exposed when hidden.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img aria-hidden="true" alt="Nope" /></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img aria-hidden={{true}} alt="foo" /></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // <img> with no alt at all — nothing to surface.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img /></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // <img alt=""> — empty alt is explicit "no accessible name".
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img alt="" /></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // Empty aria-label / aria-labelledby / title are NOT names.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-label="" /></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-labelledby="" /></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // aria-label={{""}} — static empty string in mustache is NOT a name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-label={{""}} /></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // <img alt={{""}}> — static empty string in mustache is decorative;
    // no accessible name contributed.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img alt={{""}} /></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // `&nbsp;` is normalized to space — `aria-label="&nbsp;"` is functionally
    // empty for assistive tech and should not count as an accessible name.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-label="&nbsp;" /></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // Same normalization in the `<img alt>` contribution path.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><img alt="&nbsp;" src="/x.png" /></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // Children hidden via HTML `hidden` boolean attribute are not rendered
    // and not exposed to AT (HTML §5.4) — they contribute no accessible
    // name. A `<span hidden>` inside an otherwise empty anchor should flag.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span hidden>Hidden backup</span></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span hidden>Hidden</span><span></span></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // Nested empty element.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span></span></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // aria-hidden={{"false"}} — string-literal mustache resolves to "false";
    // anchor is NOT hidden, so the content check applies and should flag.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x" aria-hidden={{"false"}} /></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    // aria-hidden={{"true"}} on a child — child is hidden, contributes nothing;
    // the anchor itself is still in scope and has no accessible content.
    {
      filename: 'test.gjs',
      code: '<template><a href="/x"><span aria-hidden={{"true"}}>X</span></a></template>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-anchor-has-content (hbs)', rule, {
  valid: [
    // Classic-HBS mirrors of the key valid GTS cases.
    '<a href="/x">link text</a>',
    '<a href="/x"><span>inner</span></a>',
    '<a href="/x" aria-label="Close" />',
    '<a href="/x" title="Open" />',
    '<a href="/x">{{@label}}</a>',
    '<a href="/x">{{this.label}}</a>',
    '<a href="/x"><img alt="Search" /></a>',
    '<Link href="/x" />',
    // Anchors without href are out of scope.
    '<a />',
    '<a>Foo</a>',
    // Valueless aria-hidden resolves to default `undefined` per ARIA §6.6 —
    // child is not hidden, its content counts.
    '<a href="/x"><span aria-hidden>X</span></a>',
    '<a href="/x"><img aria-hidden alt="Nope" /></a>',
  ],
  invalid: [
    {
      code: '<a href="/x" />',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      code: '<a href="/x"></a>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      code: '<a href="/x"><span aria-hidden="true">X</span></a>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      code: '<a href="/x"><img aria-hidden="true" alt="Nope" /></a>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      code: '<a href="/x"><img aria-hidden={{true}} alt="foo" /></a>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      code: '<a href="/x" aria-label="" />',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
    {
      code: '<a href="/x">   </a>',
      output: null,
      errors: [{ messageId: 'anchorHasContent' }],
    },
  ],
});
