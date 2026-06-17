const rule = require('../../../lib/rules/template-no-autoplay');
const RuleTester = require('eslint').RuleTester;

const ERROR_AUDIO =
  'The `autoplay` attribute is disruptive for users and has accessibility concerns on `<audio>`';
const ERROR_VIDEO =
  'The `autoplay` attribute is disruptive for users and has accessibility concerns on `<video>`';

const validHbs = [
  '<audio src="a.mp3"></audio>',
  '<video src="a.mp4" controls></video>',
  '<div autoplay></div>',
  // Bare-mustache dynamic path — unknown at lint time, skip.
  '<audio autoplay={{this.shouldAutoplay}}></audio>',
  // Bare `{{false}}` is the only literal form that makes Glimmer omit the
  // attribute (see docs/glimmer-attribute-behavior.md).
  '<video autoplay={{false}}></video>',
  // Concat with a dynamic part — unknown at lint time, skip.
  '<audio autoplay="{{shouldPlay}}"></audio>',
  '<audio autoplay="{{this.flag}}-suffix"></audio>',
  '<audio autoplay="foo{{this.bar}}"></audio>',
  // PascalCase component — not an HTML element.
  '<AutoPlayer autoplay />',
  // <video muted autoplay> is out of WCAG SC 1.4.2 scope (ACT rule aaa1bf).
  // Per docs/glimmer-attribute-behavior.md, every form below sets the muted
  // IDL property to true — including bare-string `{{"false"}}` and concat
  // `"{{false}}"` (verified: <video muted="{{false}}"> → videoEl.muted ===
  // true) — so the muted-autoplay exemption applies.
  '<video autoplay muted></video>',
  '<video autoplay muted loop playsinline></video>',
  '<video autoplay muted=""></video>',
  '<video autoplay muted="muted"></video>',
  '<video autoplay muted="false"></video>',
  '<video autoplay muted={{true}}></video>',
  '<video autoplay muted={{"false"}}></video>',
  '<video autoplay muted={{"true"}}></video>',
  '<video autoplay muted="{{false}}"></video>',
  '<video autoplay muted="{{true}}"></video>',
  // Dynamic muted — unknown at lint time, skip (false positives > false
  // negatives).
  '<video autoplay muted={{this.isMuted}}></video>',
  '<video autoplay muted="{{this.isMuted}}"></video>',
];

const invalidHbs = [
  { code: '<audio autoplay></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<video autoplay></video>', errors: [{ message: ERROR_VIDEO }] },
  { code: '<audio autoplay=""></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<audio autoplay="autoplay"></audio>', errors: [{ message: ERROR_AUDIO }] },
  // HTML boolean-attribute presence — even `autoplay="false"` is autoplay=on.
  { code: '<audio autoplay="false"></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<video autoplay="false"></video>', errors: [{ message: ERROR_VIDEO }] },
  // <audio> has no muted exception, so `autoplay muted="…"` still flags.
  { code: '<audio autoplay muted="false"></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<audio autoplay muted></audio>', errors: [{ message: ERROR_AUDIO }] },
  // Bare boolean true autoplay → IDL set, plays.
  { code: '<video autoplay={{true}}></video>', errors: [{ message: ERROR_VIDEO }] },
  // muted bare `{{false}}` is the only literal form that omits the attribute,
  // so this is genuinely muted-off → no exemption (see
  // docs/glimmer-attribute-behavior.md).
  { code: '<video autoplay muted={{false}}></video>', errors: [{ message: ERROR_VIDEO }] },
  // Per docs/glimmer-attribute-behavior.md, bare-mustache string `"false"` is
  // JS-truthy and concat with literals always sets the IDL property — so
  // these are autoplay=on, regardless of what the literal value suggests.
  { code: '<audio autoplay={{"false"}}></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<audio autoplay="{{false}}"></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<audio autoplay="{{\'false\'}}"></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<audio autoplay="{{\'true\'}}"></audio>', errors: [{ message: ERROR_AUDIO }] },
];

// Plain valid cases that need no option — kept as named constants for reuse.
const noOptionValid = ['<audio autoplay={{false}}></audio>', '<div></div>'];

// Valid cases that explicitly exercise the `additionalElements` option.
const additionalElementsValid = [
  // Custom element listed in additionalElements but without autoplay — no report.
  {
    code: '<custom-player src="a.mp4"></custom-player>',
    options: [{ additionalElements: ['custom-player'] }],
  },
];

// Opt-in `additionalElements` configured but the element doesn't carry
// autoplay — pins that the option wiring doesn't over-flag on its own.
const additionalElementsOptionValid = [
  { code: '<my-media></my-media>', options: [{ additionalElements: ['my-media'] }] },
];

const additionalElementsInvalid = [
  {
    code: '<my-media autoplay></my-media>',
    options: [{ additionalElements: ['my-media'] }],
    errors: [
      {
        message:
          'The `autoplay` attribute is disruptive for users and has accessibility concerns on `<my-media>`',
      },
    ],
  },
  // The `muted` exemption applies only to native <video>. Custom tags added
  // via `additionalElements` still flag when they carry `autoplay`, even
  // with `muted` present — we can't verify the tag's mute semantics.
  {
    code: '<my-media autoplay muted></my-media>',
    options: [{ additionalElements: ['my-media'] }],
    errors: [
      {
        message:
          'The `autoplay` attribute is disruptive for users and has accessibility concerns on `<my-media>`',
      },
    ],
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

gjsRuleTester.run('template-no-autoplay', rule, {
  valid: [
    ...gjsValid,
    ...noOptionValid.map((code) => `<template>${code}</template>`),
    ...additionalElementsValid.map(({ code, options }) => ({
      code: `<template>${code}</template>`,
      options,
    })),
    ...additionalElementsOptionValid.map(({ code, options }) => ({
      code: `<template>${code}</template>`,
      options,
    })),
  ],
  invalid: [
    ...gjsInvalid,
    ...additionalElementsInvalid.map(({ code, options, errors }) => ({
      code: `<template>${code}</template>`,
      options,
      errors,
    })),
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-autoplay', rule, {
  valid: [
    ...validHbs,
    ...noOptionValid,
    ...additionalElementsValid,
    ...additionalElementsOptionValid,
  ],
  invalid: [...invalidHbs, ...additionalElementsInvalid],
});
