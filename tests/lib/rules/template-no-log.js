//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-log');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-log', rule, {
  valid: [
    `<template>
      <div>Hello World</div>
    </template>`,
    `<template>
      {{this.log}}
    </template>`,
    `<template>
      {{logger}}
    </template>`,
    `<template>
      <div data-test-log={{true}}></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{log "debug message"}}
      </template>`,
      output: null,
      errors: [{
        message: 'Unexpected {{log}} usage.',
        type: 'GlimmerMustacheStatement',
      }],
    },
    {
      code: `<template>
        {{#if condition}}
          {{log this.value}}
        {{/if}}
      </template>`,
      output: null,
      errors: [{
        message: 'Unexpected {{log}} usage.',
        type: 'GlimmerMustacheStatement',
      }],
    },
    {
      code: `<template>
        {{#log "test"}}
          content
        {{/log}}
      </template>`,
      output: null,
      errors: [{
        message: 'Unexpected {{log}} usage.',
        type: 'GlimmerBlockStatement',
      }],
    },
  ],
});
