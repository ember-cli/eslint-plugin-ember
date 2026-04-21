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

    '<template><video><track kind="captions" /></video></template>',
    // HTML enumerated attribute values are case-insensitive, so "Captions" is
    // the same as "captions" for the track element. Matches jsx-a11y/vue-a11y.
    '<template><video><track kind="Captions" /></video></template>',
    '<template><video><track kind="CAPTIONS" /></video></template>',
    '<template><audio muted="true"></audio></template>',
    '<template><video muted></video></template>',
    '<template><audio muted={{this.muted}}></audio></template>',
    '<template><video muted="{{isMuted}}"><source src="movie.mp4" /></video></template>',
    '<template><audio muted="{{this.isMuted}}"></audio></template>',
    '<template><video><track kind="captions" /><track kind="descriptions" /></video></template>',
  ],

  invalid: [
    {
      code: `<template>
        <video src="movie.mp4"></video>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
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
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
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
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><video></video></template>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<template><audio><track /></audio></template>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<template><video><track kind="subtitles" /></video></template>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<template><audio muted="false"></audio></template>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<template><audio muted="false"><track kind="descriptions" /></audio></template>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<template><video muted=false></video></template>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-require-media-caption', rule, {
  valid: [
    '<video><track kind="captions" /></video>',
    '<audio muted="true"></audio>',
    '<video muted></video>',
    '<audio muted={{this.muted}}></audio>',
    '<video muted="{{isMuted}}"><source src="movie.mp4" /></video>',
    '<audio muted="{{this.isMuted}}"></audio>',
    '<video><track kind="captions" /><track kind="descriptions" /></video>',
  ],
  invalid: [
    {
      code: '<video></video>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<audio><track /></audio>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<video><track kind="subtitles" /></video>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<audio muted="false"></audio>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<audio muted="false"><track kind="descriptions" /></audio>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
    {
      code: '<video muted=false></video>',
      output: null,
      errors: [
        {
          message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        },
      ],
    },
  ],
});
