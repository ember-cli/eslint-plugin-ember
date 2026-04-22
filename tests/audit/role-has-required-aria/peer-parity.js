// Audit fixture — translates peer-plugin test cases into assertions against
// our rule (`ember/template-require-mandatory-role-attributes`). Runs as
// part of the default Vitest suite (via the `tests/**/*.js` include glob)
// and serves double-duty: (1) auditable record of peer-parity divergences,
// (2) regression coverage pinning CURRENT behavior. Each case encodes what
// OUR rule does today; divergences from upstream plugins are annotated as
// `DIVERGENCE —`. Peer-only constructs that can't be translated to Ember
// templates (JSX spread props, Vue v-bind, Angular `$event`, undefined-handler
// expression analysis) are marked `AUDIT-SKIP`.
//
// Source files (context/ checkouts):
//   - eslint-plugin-jsx-a11y-main/src/rules/role-has-required-aria-props.js
//   - eslint-plugin-jsx-a11y-main/__tests__/src/rules/role-has-required-aria-props-test.js
//   - eslint-plugin-vuejs-accessibility-main/src/rules/role-has-required-aria-props.ts
//   - angular-eslint-main/packages/eslint-plugin-template/src/rules/role-has-required-aria.ts
//   - angular-eslint-main/packages/eslint-plugin-template/tests/rules/role-has-required-aria/cases.ts
//   - eslint-plugin-lit-a11y/lib/rules/role-has-required-aria-attrs.js

'use strict';

const rule = require('../../../lib/rules/template-require-mandatory-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('audit:role-has-required-aria (gts)', rule, {
  valid: [
    // === Upstream parity (valid everywhere) ===
    '<template><div /></template>',
    '<template><div role="button" /></template>', // no required props
    '<template><div role="heading" aria-level="2" /></template>',
    '<template><span role="button">X</span></template>',
    // checkbox with aria-checked — valid in all plugins.
    '<template><div role="checkbox" aria-checked="false" /></template>',
    // combobox with BOTH required props (jsx-a11y, vue, ours).
    '<template><div role="combobox" aria-expanded="false" aria-controls="id" /></template>',
    // scrollbar requires aria-valuenow, aria-valuemin, aria-valuemax, aria-controls, aria-orientation.
    // slider similarly — we leave the all-present case off for brevity.

    // Dynamic role — skipped by all.
    '<template><div role={{this.role}} /></template>',

    // Unknown role — jsx-a11y filters out unknown, we return null. Both allow.
    '<template><div role="foobar" /></template>',

    // === Parity — semantic-role exemptions via axobject-query ===
    // jsx-a11y, angular-eslint, and our rule all consult axobject-query's
    // elementAXObjects + AXObjectRoles to determine when a native element
    // implements a given ARIA role. Pairings we cover (non-exhaustive):
    //   input[type=checkbox] → checkbox, switch (CheckBoxRole + SwitchRole)
    //   input[type=radio]    → radio            (RadioButtonRole)
    //   input[type=range]    → slider           (SliderRole)
    //   input[type=number]   → spinbutton       (SpinButtonRole)
    //   input[type=text]     → textbox          (TextFieldRole)
    //   input[type=search]   → searchbox        (SearchBoxRole)
    // vue-a11y: VALID only for {role: switch, type: checkbox} via its hardcoded
    //   `filterRequiredPropsExceptions`. Narrower than axobject-query coverage.
    '<template><input type="checkbox" role="switch" /></template>',
    '<template><input type="checkbox" role="checkbox" /></template>',
    '<template><input type="radio" role="radio" /></template>',
    '<template><input type="range" role="slider" /></template>',
    // HTML type keyword values are ASCII case-insensitive.
    '<template><input type="CHECKBOX" role="switch" /></template>',

    // === Parity — input + menuitemcheckbox/menuitemradio flagged ===
    // Neither axobject-query's MenuItemCheckBoxRole nor MenuItemRadioRole
    //   lists an <input> HTML concept; they only have ARIA concepts. So
    //   jsx-a11y / angular / ours all flag these pairings (captured in the
    //   `invalid` section below).

    // === DIVERGENCE — space-separated role tokens ===
    // jsx-a11y + vue: split on whitespace, validate each token. If every token
    //   is a valid role, require attrs for each.
    // Our rule: looks up the whole string in aria-query. `"combobox listbox"`
    //   is not a role → returns null → no missing attrs → NO FLAG.
    // Net: jsx-a11y would flag `<div role="combobox listbox">` (missing attrs
    //   for both), we don't. Captured as valid below.
    '<template><div role="combobox listbox" /></template>',

    // === DIVERGENCE — case-insensitivity on role value ===
    // jsx-a11y + vue + angular: lowercase the role value before lookup.
    //   `<div role="COMBOBOX" />` → INVALID (missing aria-expanded/controls).
    // Our rule: passes the raw string; aria-query lookup misses → no flag.
    '<template><div role="COMBOBOX" /></template>',
    '<template><div role="SLIDER" /></template>',
  ],

  invalid: [
    // === Upstream parity (invalid everywhere) ===
    {
      code: '<template><div role="slider" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<template><div role="checkbox" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<template><div role="combobox" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<template><div role="scrollbar" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<template><div role="heading" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<template><div role="option" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },

    // === DIVERGENCE — partial attrs present, still missing one ===
    // jsx-a11y flags `<div role="scrollbar" aria-valuemax aria-valuemin />`
    //   (missing aria-controls/aria-orientation/aria-valuenow).
    // Our rule: also flags — missing-attrs list non-empty. Parity.
    {
      code: '<template><div role="combobox" aria-controls="x" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },

    // === Pairings NOT exempt — axobject-query does not list them ===
    // Semantic-role exemption is driven by axobject-query's `elementAXObjects`
    // + `AXObjectRoles` maps — see `isSemanticRoleElement()` in the rule
    // source. Pairings the AX-tree data does not list (such as
    // `input[type=checkbox] role=radio` or `input[type=radio] role=switch`)
    // fall through to the normal required-attribute check and are flagged
    // for missing `aria-checked`.
    {
      code: '<template><input type="checkbox" role="radio" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<template><input type="radio" role="switch" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    // Bare `<input role="switch">` (no `type`) has no exempt pairing either —
    // the element defaults to `type=text`, which axobject-query does not map
    // to the switch role.
    {
      code: '<template><input role="switch" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('audit:role-has-required-aria (hbs)', rule, {
  valid: [
    '<div />',
    '<div role="button" />',
    '<div role="heading" aria-level="2" />',
    '<div role="combobox" aria-expanded="false" aria-controls="id" />',
    // Parity: axobject-query-backed semantic-role exemptions.
    '<input type="checkbox" role="switch" />',
    '<input type="range" role="slider" />',
    // DIVERGENCES captured as valid-for-us:
    //   space-separated
    '<div role="combobox listbox" />',
    //   case-insensitivity
    '<div role="COMBOBOX" />',
    //   unknown role
    '<div role="foobar" />',
  ],
  invalid: [
    {
      code: '<div role="slider" />',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<div role="checkbox" />',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<div role="heading" />',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    // DIVERGENCE: pairings NOT in our input+role whitelist stay flagged.
    //   jsx-a11y/angular recognize more pairings via axobject-query.
    {
      code: '<input type="checkbox" role="radio" />',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
    {
      code: '<input role="switch" />',
      output: null,
      errors: [{ messageId: 'missingAttributes' }],
    },
  ],
});
