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
  '<audio autoplay={{this.shouldAutoplay}}></audio>',
  '<video autoplay={{false}}></video>',
  '<audio autoplay={{"false"}}></audio>',
  // Quoted-mustache (GlimmerConcatStatement) opt-out/unknown forms.
  '<audio autoplay="{{false}}"></audio>',
  '<audio autoplay="{{shouldPlay}}"></audio>',
  // ConcatStatement with a dynamic path part and static suffix — unknown at lint time, skip.
  '<audio autoplay="{{this.flag}}-suffix"></audio>',
  // Mixed static+dynamic concat — dynamic mustache part makes it unknown at lint time, skip.
  '<audio autoplay="foo{{this.bar}}"></audio>',
  // GlimmerConcatStatement with single `{{false}}` part on muted — treated as falsy (muted on).
  '<video autoplay muted="{{false}}"></video>',
  // Dynamic muted via concat — unknown at lint time, skip.
  '<video autoplay muted="{{this.isMuted}}"></video>',
  // PascalCase component — not an HTML element
  '<AutoPlayer autoplay />',
  // <video muted autoplay> is out of WCAG SC 1.4.2 scope (ACT rule aaa1bf).
  '<video autoplay muted></video>',
  '<video autoplay muted loop playsinline></video>',
  '<video autoplay muted=""></video>',
  '<video autoplay muted="muted"></video>',
  // Boolean-attribute semantics: `muted="false"` is still muted=on, so this
  // is still within the <video muted autoplay> exemption.
  '<video autoplay muted="false"></video>',
  '<video autoplay muted={{true}}></video>',
  // Unknown mustache for `muted` → skip (false positives > false negatives).
  '<video autoplay muted={{this.isMuted}}></video>',
];

const invalidHbs = [
  { code: '<audio autoplay></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<video autoplay></video>', errors: [{ message: ERROR_VIDEO }] },
  { code: '<audio autoplay=""></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<audio autoplay="autoplay"></audio>', errors: [{ message: ERROR_AUDIO }] },
  // HTML boolean-attribute semantics: the string "false" is still attribute
  // presence, so `autoplay="false"` counts as autoplay=on.
  { code: '<audio autoplay="false"></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<video autoplay="false"></video>', errors: [{ message: ERROR_VIDEO }] },
  // Same boolean-attribute semantics for `muted`: `muted="false"` still
  // evaluates as muted, so `<video autoplay muted="false">` is an exempt
  // muted-autoplay case — but `<audio>` has no muted exception.
  { code: '<audio autoplay muted="false"></audio>', errors: [{ message: ERROR_AUDIO }] },
  { code: '<video autoplay={{true}}></video>', errors: [{ message: ERROR_VIDEO }] },
  // muted exception is <video>-only: <audio muted autoplay> is still flagged.
  { code: '<audio autoplay muted></audio>', errors: [{ message: ERROR_AUDIO }] },
  // muted present but statically falsy — autoplay still flagged on <video>.
  { code: '<video autoplay muted={{false}}></video>', errors: [{ message: ERROR_VIDEO }] },
  { code: '<video autoplay muted={{"false"}}></video>', errors: [{ message: ERROR_VIDEO }] },
  // Quoted-mustache concat with a static string-literal part → truthy.
  { code: '<audio autoplay="{{\'true\'}}"></audio>', errors: [{ message: ERROR_AUDIO }] },
];

// Plain valid cases that need no option — kept as named constants for reuse.
const noOptionValid = ['<audio autoplay={{false}}></audio>', '<div></div>'];

// Valid cases that explicitly exercise the `additionalElements` option.
const additionalElementsValid = [
  // Custom element listed in additionalElements but without autoplay — no report.
  { code: '<custom-player src="a.mp4"></custom-player>', options: [{ additionalElements: ['custom-player'] }] },
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
  valid: [...validHbs, ...noOptionValid, ...additionalElementsValid, ...additionalElementsOptionValid],
  invalid: [...invalidHbs, ...additionalElementsInvalid],
});
