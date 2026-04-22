// Audit fixture — translates peer-plugin test cases into assertions against
// our rule (`ember/template-no-redundant-role`). Runs as part of the default
// Vitest suite (via the `tests/**/*.js` include glob) and serves double-duty:
// (1) auditable record of peer-parity divergences, (2) regression coverage
// pinning CURRENT behavior. Each case encodes what OUR rule does today;
// divergences from upstream plugins are annotated as `DIVERGENCE —`.
// Peer-only constructs that can't be translated to Ember templates (JSX
// spread props, Vue v-bind, Angular `$event`, undefined-handler expression
// analysis) are marked `AUDIT-SKIP`.
//
// Source files (context/ checkouts):
//   - eslint-plugin-jsx-a11y-main/src/rules/no-redundant-roles.js
//   - eslint-plugin-jsx-a11y-main/__tests__/src/rules/no-redundant-roles-test.js
//   - eslint-plugin-vuejs-accessibility-main/src/rules/no-redundant-roles.ts
//   - eslint-plugin-lit-a11y/lib/rules/no-redundant-role.js

'use strict';

const rule = require('../../../lib/rules/template-no-redundant-role');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('audit:no-redundant-roles (gts)', rule, {
  valid: [
    // === Upstream parity (valid in all plugins + ours) ===
    // No role attribute.
    '<template><div></div></template>',
    // Role differs from implicit.
    '<template><button role="link"></button></template>',
    '<template><button role="main"></button></template>',
    // jsx-a11y/lit-a11y default exception: nav[role="navigation"] is allowed.
    // Our ALLOWED_ELEMENT_ROLES also permits this.
    '<template><nav role="navigation"></nav></template>',
    // form[role="search"] — different from implicit "form" role.
    '<template><form role="search"></form></template>',
    // Dynamic role — we skip.
    '<template><footer role={{this.foo}}></footer></template>',

    // === DIVERGENCE — <ul role="list"> / <ol role="list"> ===
    // jsx-a11y: INVALID — implicit role of ul/ol is "list".
    // Our rule: VALID — ALLOWED_ELEMENT_ROLES explicitly permits these.
    // Rationale (ember-template-lint carry-over): `role="list"` on ul/ol is
    // a deliberate workaround for Safari/VoiceOver stripping list semantics
    // when `list-style: none` is applied. This is a well-known pattern.
    '<template><ul role="list"></ul></template>',
    '<template><ol role="list"></ol></template>',

    // === DIVERGENCE — <a role="link"> ===
    // jsx-a11y: INVALID only if <a> has href (implicit role "link" requires href).
    //   Without href, <a> has no implicit role — so <a role="link"> is VALID.
    // Our rule: VALID regardless — ALLOWED_ELEMENT_ROLES includes {a, link}.
    // The user's existing test treats this as valid, so we encode that.
    '<template><a role="link" aria-disabled="true">valid</a></template>',

    // === DIVERGENCE — <input role="combobox"> ===
    // jsx-a11y: implicit role depends on `type`. Default <input> (type=text)
    //   has implicit "textbox". So <input role="combobox"> would be VALID.
    // Our rule: VALID — ALLOWED_ELEMENT_ROLES includes {input, combobox}.
    // Parity by coincidence.
    '<template><input role="combobox" /></template>',

    // === Parity — <select role="combobox"> gated on multiple/size ===
    // jsx-a11y: INVALID — default <select> has implicit role "combobox".
    // Our rule: now INVALID for a default <select> (captured in invalid
    //   section below). Stays VALID when `multiple` or `size > 1` is set —
    //   those cases give <select> an implicit role of "listbox", so an
    //   explicit "combobox" is a genuine role override, not a redundancy.
    '<template><select role="combobox" multiple><option>1</option></select></template>',
    '<template><select role="combobox" size="5"><option>1</option></select></template>',
  ],

  invalid: [
    // === Upstream parity (invalid in jsx-a11y + ours) ===
    {
      code: '<template><dialog role="dialog" /></template>',
      output: '<template><dialog /></template>',
      errors: [{ message: 'Use of redundant or invalid role: dialog on <dialog> detected.' }],
    },
    {
      code: '<template><button role="button"></button></template>',
      output: '<template><button></button></template>',
      errors: [{ message: 'Use of redundant or invalid role: button on <button> detected.' }],
    },
    {
      code: '<template><img role="img" /></template>',
      output: '<template><img /></template>',
      errors: [{ message: 'Use of redundant or invalid role: img on <img> detected.' }],
    },
    {
      code: '<template><body role="document"></body></template>',
      output: '<template><body></body></template>',
      errors: [{ message: 'Use of redundant or invalid role: document on <body> detected.' }],
    },
    // Landmark elements — error message is the "landmark" variant for us.
    {
      code: '<template><header role="banner"></header></template>',
      output: '<template><header></header></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<template><main role="main"></main></template>',
      output: '<template><main></main></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<template><aside role="complementary"></aside></template>',
      output: '<template><aside></aside></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<template><footer role="contentinfo"></footer></template>',
      output: '<template><footer></footer></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: contentinfo on <footer> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },

    // === Parity — case-insensitive role comparison ===
    // jsx-a11y (via getExplicitRole), vuejs-accessibility via aria-query,
    //   and now our rule all lowercase the role value before lookup.
    // `<body role="DOCUMENT">` is flagged.
    {
      code: '<template><body role="DOCUMENT"></body></template>',
      output: '<template><body></body></template>',
      errors: [{ message: 'Use of redundant or invalid role: document on <body> detected.' }],
    },

    // === Parity — <select role="combobox"> (default <select>) ===
    // Default <select> (no multiple/size) has implicit role "combobox"
    //   per HTML-AAM; explicit `role="combobox"` is redundant.
    {
      code: '<template><select role="combobox"><option>1</option></select></template>',
      output: '<template><select><option>1</option></select></template>',
      errors: [{ message: 'Use of redundant or invalid role: combobox on <select> detected.' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('audit:no-redundant-roles (hbs)', rule, {
  valid: [
    '<div></div>',
    '<button role="main"></button>',
    '<nav role="navigation"></nav>',
    '<form role="search"></form>',
    // DIVERGENCE — ul/ol list kept valid by design (see gts section).
    '<ul role="list"></ul>',
    '<ol role="list"></ol>',
    // DIVERGENCE — <a role="link"> kept valid by design.
    '<a role="link">x</a>',
    // Parity — <select role="combobox" multiple> stays valid (implicit listbox).
    '<select role="combobox" multiple><option>1</option></select>',
  ],
  invalid: [
    {
      code: '<button role="button"></button>',
      output: '<button></button>',
      errors: [{ message: 'Use of redundant or invalid role: button on <button> detected.' }],
    },
    {
      code: '<img role="img" />',
      output: '<img />',
      errors: [{ message: 'Use of redundant or invalid role: img on <img> detected.' }],
    },
    {
      code: '<main role="main"></main>',
      output: '<main></main>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    // Parity — case-insensitive comparison (jsx-a11y also flags).
    {
      code: '<body role="DOCUMENT"></body>',
      output: '<body></body>',
      errors: [{ message: 'Use of redundant or invalid role: document on <body> detected.' }],
    },
    // Parity — default <select> implicit role is combobox.
    {
      code: '<select role="combobox"><option>1</option></select>',
      output: '<select><option>1</option></select>',
      errors: [{ message: 'Use of redundant or invalid role: combobox on <select> detected.' }],
    },
  ],
});
