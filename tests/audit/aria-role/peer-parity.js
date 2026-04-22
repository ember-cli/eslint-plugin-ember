// Audit fixture — translates peer-plugin test cases into assertions against
// our rule (`ember/template-no-invalid-role` + `ember/template-no-abstract-roles`).
// Runs as part of the default Vitest suite (via the `tests/**/*.js` include
// glob) and serves double-duty: (1) auditable record of peer-parity
// divergences, (2) regression coverage pinning CURRENT behavior. Each case
// encodes what OUR rule does today; divergences from upstream plugins are
// annotated as `DIVERGENCE —`. Peer-only constructs that can't be translated
// to Ember templates (JSX spread props, Vue v-bind, Angular `$event`,
// undefined-handler expression analysis) are marked `AUDIT-SKIP`.
//
// Peers covered: jsx-a11y/aria-role, vuejs-accessibility/aria-role,
// lit-a11y/aria-role.
//
// Source files (context/ checkouts):
//   - eslint-plugin-jsx-a11y-main/__tests__/src/rules/aria-role-test.js
//   - eslint-plugin-vuejs-accessibility-main/src/rules/__tests__/aria-role.test.ts
//   - eslint-plugin-lit-a11y/tests/lib/rules/aria-role.js

'use strict';

const rule = require('../../../lib/rules/template-no-invalid-role');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('audit:aria-role (gts)', rule, {
  valid: [
    // === Upstream parity (valid in both jsx-a11y and us) ===
    // jsx-a11y: valid (base case, no role)
    '<template><div /></template>',
    '<template><div></div></template>',

    // jsx-a11y / vue-a11y / lit-a11y: valid (concrete, non-abstract, single role)
    '<template><div role="button"></div></template>',
    '<template><div role="progressbar"></div></template>',
    '<template><div role="navigation"></div></template>',
    '<template><div role="alert"></div></template>',
    '<template><div role="switch"></div></template>',

    // Dynamic role — both plugins and we skip
    '<template><div role={{this.role}}></div></template>',
    '<template><div role="{{if @open "dialog" "contentinfo"}}"></div></template>',

    // === DIVERGENCE — case-insensitivity ===
    // jsx-a11y: INVALID (`<div role="Button" />` is rejected, case-sensitive).
    // Our rule lowercases the role before lookup; we allow this. Intentional:
    // HTML attribute values are case-insensitive in many contexts, and the
    // existing test suite encodes this as an explicit design choice.
    '<template><div role="Button">Click</div></template>',
    '<template><div role="NAVIGATION">Nav</div></template>',

    // === Parity — space-separated multiple roles ===
    // jsx-a11y / vuejs-accessibility: VALID — splits on whitespace, each
    //   token must be a valid role. Our rule now does the same.
    '<template><div role="tabpanel row"></div></template>',
    '<template><section role="doc-appendix doc-bibliography"></section></template>',

    // === Parity — DPUB-ARIA (doc-*) roles ===
    // jsx-a11y / vuejs-accessibility: VALID via aria-query. Our rule now
    //   derives VALID_ROLES from aria-query's concrete role keys, covering
    //   all 40+ doc-* roles.
    '<template><div role="doc-abstract"></div></template>',
    '<template><section role="doc-appendix"></section></template>',

    // === Parity — Graphics-ARIA (graphics-*) roles on <svg> ===
    // jsx-a11y: VALID. Our rule: VALID via aria-query.
    '<template><svg role="graphics-document"></svg></template>',
    '<template><svg role="graphics-document document"></svg></template>',
  ],

  invalid: [
    // === Upstream parity (invalid in both jsx-a11y and us) ===
    {
      code: '<template><div role="foobar"></div></template>',
      output: null,
      errors: [{ messageId: 'invalid' }],
    },
    {
      code: '<template><div role="datepicker"></div></template>',
      output: null,
      errors: [{ messageId: 'invalid' }],
    },
    // jsx-a11y: invalid (`range` is an abstract role).
    // Ours: `range` is not in VALID_ROLES so we flag it as "not a valid ARIA role".
    // Upstream says "abstract role"; we conflate. Message wording differs.
    {
      code: '<template><div role="range"></div></template>',
      output: null,
      errors: [{ messageId: 'invalid' }],
    },

    // === DIVERGENCE — empty role string ===
    // jsx-a11y: INVALID — `<div role="" />` flagged.
    // vue-a11y: INVALID — same.
    // Our rule: early-return on empty/whitespace role (line 229 of rule). NO FLAG.
    // So this case reflects OUR (non-flagging) behavior with an explicit note.
    // (No invalid assertion possible here — we'd need to move this to valid,
    //  or fix the rule to flag.)

    // === Parity — space-separated with at least one invalid token ===
    // jsx-a11y: INVALID — splits and flags the token `foobar`.
    // Our rule: splits on whitespace and now names the offending token
    //   specifically (`'foobar'`) rather than the whole compound string.
    {
      code: '<template><div role="tabpanel row foobar"></div></template>',
      output: null,
      errors: [{ messageId: 'invalid' }],
    },
  ],
});

// === DIVERGENCE — empty role string (captured as valid because we don't flag) ===
// Intentionally isolated so the intent is clear.
ruleTester.run('audit:aria-role empty string (gts)', rule, {
  valid: [
    // jsx-a11y + vue-a11y both flag this. We don't. This captures OUR behavior.
    '<template><div role=""></div></template>',
  ],
  invalid: [],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('audit:aria-role (hbs)', rule, {
  valid: [
    '<div></div>',
    '<div role="button"></div>',
    '<div role="navigation"></div>',
    // DIVERGENCE case-insensitivity (see gts section).
    '<div role="Button"></div>',
    // DIVERGENCE empty string (we don't flag).
    '<div role=""></div>',
    // Parity — space-separated all-valid tokens.
    '<div role="tabpanel row"></div>',
    // Parity — DPUB-ARIA.
    '<div role="doc-abstract"></div>',
    // Parity — Graphics-ARIA on <svg>.
    '<svg role="graphics-document"></svg>',
  ],
  invalid: [
    {
      code: '<div role="foobar"></div>',
      output: null,
      errors: [{ messageId: 'invalid' }],
    },
    // Parity — compound with at least one invalid token.
    {
      code: '<div role="tabpanel row foobar"></div>',
      output: null,
      errors: [{ messageId: 'invalid' }],
    },
  ],
});
