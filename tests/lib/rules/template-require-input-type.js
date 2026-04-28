const rule = require('../../../lib/rules/template-require-input-type');
const RuleTester = require('eslint').RuleTester;

const ERROR_MISSING = 'All `<input>` elements should have a `type` attribute';
const errInvalid = (value) => `\`<input type="${value}">\` is not a valid input type`;

const validHbs = [
  '<input type="text" />',
  '<input type="email" />',
  '<input type="checkbox" />',
  '<input type="submit" />',
  '<input type="datetime-local" />',
  '<input type="{{this.inputType}}" />',
  '<input type={{this.inputType}} />',
  '<div />',
  '<div type="foo" />',
  '<MyInput type="unknown" />',
  // Default (requireExplicit=false): missing `type` is allowed.
  '<input />',
  '<input name="email" />',
];

const invalidHbs = [
  {
    code: '<input type="" />',
    output: '<input type="text" />',
    errors: [{ message: errInvalid('') }],
  },
  {
    code: '<input type="foo" />',
    output: '<input type="text" />',
    errors: [{ message: errInvalid('foo') }],
  },
  {
    code: '<input type="TEXTY" />',
    output: '<input type="text" />',
    errors: [{ message: errInvalid('TEXTY') }],
  },
  // Valueless type attribute — per HTML spec resolves to the missing-value
  // default (Text state), same runtime result as `type=""`. Flag and autofix
  // to `type="text"`. (Output loses the pre-slash space because the
  // valueless attr range ends at `type`; prettier will re-insert if needed.)
  {
    code: '<input type />',
    output: '<input type="text"/>',
    errors: [{ message: errInvalid('') }],
  },
];

const requireExplicitInvalid = [
  {
    code: '<input />',
    options: [{ requireExplicit: true }],
    output: '<input type="text" />',
    errors: [{ message: ERROR_MISSING }],
  },
  {
    code: '<input name="email" />',
    options: [{ requireExplicit: true }],
    output: '<input type="text" name="email" />',
    errors: [{ message: ERROR_MISSING }],
  },
  {
    code: '<input   name="email"   />',
    options: [{ requireExplicit: true }],
    output: '<input type="text"   name="email"   />',
    errors: [{ message: ERROR_MISSING }],
  },
];

const requireExplicitValid = [
  // With requireExplicit: an explicit known type satisfies the rule.
  { code: '<input type="text" />', options: [{ requireExplicit: true }] },
  // Dynamic type also satisfies — we can't know the runtime value.
  { code: '<input type={{this.inputType}} />', options: [{ requireExplicit: true }] },
];

const gjsValid = validHbs.map((code) => `<template>${code}</template>`);
const gjsInvalid = invalidHbs.map(({ code, output, errors }) => ({
  code: `<template>${code}</template>`,
  output: `<template>${output}</template>`,
  errors,
}));

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-require-input-type', rule, {
  valid: [
    ...gjsValid,
    ...requireExplicitValid.map(({ code, options }) => ({
      code: `<template>${code}</template>`,
      options,
    })),
    // Scope-shadowed `input` — the template's `<input>` refers to the local
    // const binding (a component), not the native HTML element. The rule
    // skips it via `isNativeElement`'s scope check.
    `const input = 'foo';
<template><input type="not-a-valid-type" /></template>`,
    `const input = 'foo';
<template><input /></template>`,
    // Block-param shadowing — `<Foo as |input|>` binds `input` inside the
    // yield block. The inner `<input>` should resolve to the block-param,
    // not the native tag.
    `import Foo from 'whatever';
<template><Foo as |input|><input type="not-a-valid-type" /></Foo></template>`,
  ],
  invalid: [
    ...gjsInvalid,
    ...requireExplicitInvalid.map(({ code, options, output, errors }) => ({
      code: `<template>${code}</template>`,
      options,
      output: `<template>${output}</template>`,
      errors,
    })),
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-require-input-type', rule, {
  valid: [...validHbs, ...requireExplicitValid],
  invalid: [...invalidHbs, ...requireExplicitInvalid],
});
