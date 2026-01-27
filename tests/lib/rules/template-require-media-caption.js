//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-media-caption');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-media-caption', rule, {
  valid: [
    `<template>
      <video>
        <track kind="captions" src="captions.vtt" />
      </video>
    </template>`,
    `<template>
      <audio>
        <track kind="captions" src="captions.vtt" />
      </audio>
    </template>`,
    `<template>
      <div>No media elements</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <video src="movie.mp4"></video>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Media elements (<video>) must have a <track> element with kind="captions".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <audio src="audio.mp3"></audio>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Media elements (<audio>) must have a <track> element with kind="captions".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <video>
          <track kind="subtitles" src="subs.vtt" />
        </video>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Media elements (<video>) must have a <track> element with kind="captions".',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
