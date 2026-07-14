const rule = require('../../../lib/rules/template-valid-autocomplete');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  // form on/off.
  '<form autocomplete="off"></form>',
  '<form autocomplete="on"></form>',
  '<form autocomplete="ON"></form>',
  // control on/off.
  '<input type="text" autocomplete="on" />',
  '<input type="text" autocomplete="off" />',
  // Basic field name.
  '<input type="email" autocomplete="email" />',
  '<input type="text" autocomplete="given-name" />',
  '<input type="password" autocomplete="new-password" />',
  '<input type="password" autocomplete="current-password" />',
  // Full pattern: section + hint + field + webauthn.
  '<input type="text" autocomplete="section-ship shipping address-line1" />',
  '<input type="text" autocomplete="billing family-name" />',
  '<input type="password" autocomplete="new-password webauthn" />',
  // No control-group check: field name paired with an unrelated input type
  // is NOT flagged. We defer to axe-core's behavior (grammar only).
  '<input type="text" autocomplete="current-password" />',
  '<input type="text" autocomplete="street-address" />',
  '<input type="email" autocomplete="photo" />',
  // Contact with field2.
  '<input type="email" autocomplete="work email" />',
  '<input type="tel" autocomplete="home tel" />',
  // textarea / select.
  '<textarea autocomplete="street-address"></textarea>',
  '<select autocomplete="country"><option>NO</option></select>',
  // Dynamic — skip.
  '<input type="text" autocomplete={{this.ac}} />',
  // Non-form-control — skip.
  '<div autocomplete="anything"></div>',
  // hidden with valid field.
  '<input type="hidden" autocomplete="family-name" />',
];

const invalidHbs = [
  // form: invalid value.
  {
    code: '<form autocomplete="yes"></form>',
    errors: [{ message: '`<form autocomplete>` can only be `"on"` or `"off"` (got `"yes"`)' }],
  },
  // Empty autocomplete on form — invalid (not on/off).
  {
    code: '<form autocomplete=""></form>',
    errors: [{ message: '`<form autocomplete>` can only be `"on"` or `"off"` (got `""`)' }],
  },
  // Empty autocomplete on a control — no field name, nothing to match.
  {
    code: '<input type="text" autocomplete="" />',
    errors: [{ message: '`autocomplete` attribute is missing a field name' }],
  },
  // Whitespace-only counts the same.
  {
    code: '<input type="text" autocomplete="   " />',
    errors: [{ message: '`autocomplete` attribute is missing a field name' }],
  },
  // Valueless attribute — treated as empty string, invalid.
  {
    code: '<input type="text" autocomplete />',
    errors: [{ message: '`autocomplete` attribute is missing a field name' }],
  },
  {
    code: '<form autocomplete></form>',
    errors: [{ message: '`<form autocomplete>` can only be `"on"` or `"off"` (got `""`)' }],
  },
  // hidden: on/off forbidden.
  {
    code: '<input type="hidden" autocomplete="off" />',
    errors: [{ message: '`<input type="hidden">` cannot use the autocomplete value `"off"`' }],
  },
  // Disallowed input types.
  {
    code: '<input type="checkbox" autocomplete="email" />',
    errors: [{ message: '`autocomplete` cannot be used on `<input type="checkbox">`' }],
  },
  {
    code: '<input type="submit" autocomplete="email" />',
    errors: [{ message: '`autocomplete` cannot be used on `<input type="submit">`' }],
  },
  // Invalid token.
  {
    code: '<input type="text" autocomplete="first-name" />',
    errors: [
      {
        message: '`"first-name"` is not a valid autocomplete token or field name',
      },
    ],
  },
  // on/off combined with other tokens.
  {
    code: '<input type="text" autocomplete="off street-address" />',
    errors: [{ message: '`"off"` cannot be combined with other autocomplete tokens' }],
  },
  // Missing field.
  {
    code: '<input type="text" autocomplete="section-a" />',
    errors: [{ message: '`autocomplete` attribute is missing a field name' }],
  },
  {
    code: '<input type="text" autocomplete="shipping" />',
    errors: [{ message: '`autocomplete` attribute is missing a field name' }],
  },
  // Multiple fields.
  {
    code: '<input type="email" autocomplete="home email family-name" />',
    errors: [{ message: 'autocomplete attribute must contain exactly one field name' }],
  },
  // Contact with wrong field group.
  {
    code: '<input type="text" autocomplete="home family-name" />',
    errors: [
      {
        message: '`"home"` cannot be combined with field name `"family-name"`',
      },
    ],
  },
  // Multiple contact modifiers — HTML §4.10.19.9 allows at most one.
  {
    code: '<input type="email" autocomplete="home work email" />',
    errors: [
      {
        message:
          '`"work"` cannot be combined with another contact modifier — autocomplete allows at most one of `home`, `work`, `mobile`, `fax`, `pager`',
      },
    ],
  },
  {
    code: '<input type="tel" autocomplete="mobile pager tel" />',
    errors: [
      {
        message:
          '`"pager"` cannot be combined with another contact modifier — autocomplete allows at most one of `home`, `work`, `mobile`, `fax`, `pager`',
      },
    ],
  },
  // Same contact token repeated — still flagged (count > 1 regardless of
  // whether it's the same or different token).
  {
    code: '<input type="tel" autocomplete="home home tel" />',
    errors: [
      {
        message:
          '`"home"` cannot be combined with another contact modifier — autocomplete allows at most one of `home`, `work`, `mobile`, `fax`, `pager`',
      },
    ],
  },
  // Order violation (webauthn before field).
  {
    code: '<input type="password" autocomplete="webauthn current-password" />',
    errors: [
      {
        message: '`"current-password"` must appear before `"webauthn"` in autocomplete',
      },
    ],
  },
  // `section-` with empty identifier is not a valid token.
  {
    code: '<input type="text" autocomplete="section- given-name" />',
    errors: [{ message: '`"section-"` is not a valid autocomplete token or field name' }],
  },
  // Multiplicity: at most one section-*.
  {
    code: '<input type="text" autocomplete="section-a section-b given-name" />',
    errors: [{ message: 'autocomplete can contain at most one `section-*` token' }],
  },
  // Multiplicity: shipping and billing are mutually exclusive.
  {
    code: '<input type="text" autocomplete="shipping billing street-address" />',
    errors: [
      {
        message: 'autocomplete can contain at most one hint token (`shipping` or `billing`)',
      },
    ],
  },
  // Multiplicity: webauthn at most once.
  {
    code: '<input type="email" autocomplete="webauthn webauthn email" />',
    errors: [{ message: '`"webauthn"` may appear at most once in autocomplete' }],
  },
];

const gjsValid = validHbs.map((code) => `<template>${code}</template>`);
const gjsInvalid = invalidHbs.map(({ code, errors }) => ({
  code: `<template>${code}</template>`,
  errors,
}));

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-valid-autocomplete', rule, {
  valid: gjsValid,
  invalid: gjsInvalid,
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-valid-autocomplete', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
