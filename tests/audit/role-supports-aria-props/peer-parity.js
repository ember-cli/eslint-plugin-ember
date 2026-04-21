// Audit fixture — peer-plugin parity for
// `ember/template-no-unsupported-role-attributes`.
//
// Source files (context/ checkouts):
//   - eslint-plugin-jsx-a11y-main/src/rules/role-supports-aria-props.js
//   - eslint-plugin-jsx-a11y-main/__tests__/src/rules/role-supports-aria-props-test.js
//   - eslint-plugin-lit-a11y/lib/rules/role-supports-aria-attr.js
//   - eslint-plugin-lit-a11y/tests/lib/rules/role-supports-aria-attr.js
//
// These tests are NOT part of the main suite and do not run in CI. They encode
// the CURRENT behavior of our rule. Each divergence from an upstream plugin is
// annotated as "DIVERGENCE —".

'use strict';

const rule = require('../../../lib/rules/template-no-unsupported-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('audit:role-supports-aria-props (gts)', rule, {
  valid: [
    // === Upstream parity (valid in jsx-a11y + ours) ===
    '<template><div /></template>',
    '<template><div id="main" /></template>',

    // Explicit role with supported attr.
    '<template><div role="heading" aria-level="1" /></template>',
    '<template><div role="button" aria-disabled="true" /></template>',
    '<template><div role="textbox" aria-required="true" aria-errormessage="err" /></template>',
    '<template><span role="checkbox" aria-checked={{this.checked}} /></template>',

    // Implicit role tests that match between jsx-a11y and aria-query
    // (we rely on aria-query's elementRoles).
    // a with href — aria-query gives "generic" for first match; jsx-a11y
    //   gives "link". Both happen to support aria-describedby etc.
    '<template><a href="#" aria-describedby="x"></a></template>',
    // input[type=submit] — implicit "button".
    '<template><input type="submit" aria-disabled="true" /></template>',
    // select — implicit "combobox".
    '<template><select aria-expanded="false" aria-controls="ctrlID" /></template>',
    // menu[type=toolbar] — aria-query gives "list"; jsx-a11y gives "toolbar".
    //   aria-hidden is a global attr supported by both — valid in both.
    '<template><menu type="toolbar" aria-hidden="true" /></template>',

    // Components / unknown elements are skipped.
    '<template><CustomComponent role="banner" /></template>',
    '<template><some-custom-element /></template>',

    // Dynamic role (mustache value) — we skip.
    // jsx-a11y similarly skips non-literal role values.

    // === DIVERGENCE — <a> without href ===
    // jsx-a11y: `<a>` without href has NO implicit role → uses global aria
    //   set → `<a aria-checked />` is VALID.
    // Our rule: aria-query's first entry for `a` has no attribute constraint
    //   and returns "generic". `generic` does not support aria-checked → we
    //   would FLAG. (Invalid section captures this.)
    // Captured as the opposite: `<a aria-describedby="x">` passes in both
    //   because aria-describedby is global.
    '<template><a aria-describedby="x"></a></template>',
  ],
  invalid: [
    // === Upstream parity (invalid in jsx-a11y + ours) ===
    // Explicit role rejects unsupported attrs.
    {
      code: '<template><div role="link" href="#" aria-checked /></template>',
      output: '<template><div role="link" href="#" /></template>',
      errors: [{ messageId: 'unsupportedExplicit' }],
    },
    {
      code: '<template><div role="option" aria-notreal="x" aria-selected="false" /></template>',
      output: '<template><div role="option" aria-selected="false" /></template>',
      errors: [{ messageId: 'unsupportedExplicit' }],
    },
    {
      code: '<template><div role="combobox" aria-multiline="true" aria-expanded="false" aria-controls="x" /></template>',
      output:
        '<template><div role="combobox" aria-expanded="false" aria-controls="x" /></template>',
      errors: [{ messageId: 'unsupportedExplicit' }],
    },
    {
      code: '<template><a role="menuitem" aria-checked={{this.checked}} /></template>',
      output: '<template><a role="menuitem" /></template>',
      errors: [{ messageId: 'unsupportedExplicit' }],
    },

    // Implicit role rejects unsupported attrs (parity).
    {
      code: '<template><button type="submit" aria-valuetext="x"></button></template>',
      output: '<template><button type="submit"></button></template>',
      errors: [{ messageId: 'unsupportedImplicit' }],
    },
    {
      code: '<template><input type="button" aria-invalid="grammar" /></template>',
      output: '<template><input type="button" /></template>',
      errors: [{ messageId: 'unsupportedImplicit' }],
    },

    // === DIVERGENCE — role-name in message differs for <menu type="toolbar"> ===
    // jsx-a11y reports role "toolbar"; we report role "list".
    // Both FLAG though, so the divergence is cosmetic (message text).
    {
      code: '<template><menu type="toolbar" aria-expanded="true" /></template>',
      output: '<template><menu type="toolbar" /></template>',
      errors: [
        {
          message:
            'The attribute aria-expanded is not supported by the element menu with the implicit role of list',
        },
      ],
    },

    // === DIVERGENCE — role-name differs for <body> ===
    // jsx-a11y: <body> implicit role = "document".
    // Our rule: aria-query first match gives role "generic".
    // aria-expanded is unsupported by both, so both FLAG — diff is message.
    {
      code: '<template><body aria-expanded="true"></body></template>',
      output: '<template><body></body></template>',
      errors: [
        {
          message:
            'The attribute aria-expanded is not supported by the element body with the implicit role of generic',
        },
      ],
    },

    // === Parity — <input type="email"> without `list` → textbox ===
    // jsx-a11y considers these to be "textbox" (since aria-query's first
    //   "email" entry has "list attribute not set" constraint → textbox).
    // Our rule now honors aria-query attribute constraints: `type=email`
    //   without a `list` attribute maps to "textbox". With `list=...` it
    //   maps to "combobox" (sibling case below).
    // aria-level is not supported by either role; still flagged.
    {
      code: '<template><input type="email" aria-level={{this.level}} /></template>',
      output: '<template><input type="email" /></template>',
      errors: [
        {
          message:
            'The attribute aria-level is not supported by the element input with the implicit role of textbox',
        },
      ],
    },
    // <input type="email" list="x"> → "combobox" (aria-level unsupported there too).
    {
      code: '<template><input type="email" list="x" aria-level={{this.level}} /></template>',
      output: '<template><input type="email" list="x" /></template>',
      errors: [
        {
          message:
            'The attribute aria-level is not supported by the element input with the implicit role of combobox',
        },
      ],
    },

    // === DIVERGENCE — <a> without href, with non-global aria attr ===
    // jsx-a11y: VALID (no implicit role → global set).
    // Our rule: role=generic, aria-checked not supported → FLAG. FALSE POSITIVE.
    {
      code: '<template><a aria-checked /></template>',
      output: '<template><a /></template>',
      errors: [{ messageId: 'unsupportedImplicit' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('audit:role-supports-aria-props (hbs)', rule, {
  valid: [
    '<div />',
    '<div role="heading" aria-level="1" />',
    '<div role="button" aria-disabled="true" />',
    '<a href="#" aria-describedby=""></a>',
    '<menu type="toolbar" aria-hidden="true" />',
    '<input type="submit" aria-disabled="true" />',
  ],
  invalid: [
    {
      code: '<div role="link" href="#" aria-checked />',
      output: '<div role="link" href="#" />',
      errors: [{ message: 'The attribute aria-checked is not supported by the role link' }],
    },
    {
      code: '<menu type="toolbar" aria-expanded="true" />',
      output: '<menu type="toolbar" />',
      errors: [
        {
          message:
            'The attribute aria-expanded is not supported by the element menu with the implicit role of list',
        },
      ],
    },
    // DIVERGENCE: <a aria-checked /> — jsx-a11y says valid (no implicit role).
    // We flag with implicit role "generic".
    {
      code: '<a aria-checked />',
      output: '<a />',
      errors: [{ messageId: 'unsupportedImplicit' }],
    },
  ],
});
