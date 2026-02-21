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
  
    // Test cases ported from ember-template-lint
    '<template>{{foo}}</template>',
    '<template>{{button}}</template>',
    '<template>{{#each this.logs as |log|}}{{log}}{{/each}}</template>',
    '<template>{{#let this.log as |log|}}{{log}}{{/let}}</template>',
    '<template>{{#let (component "my-log-component") as |log|}}{{#log}}message{{/log}}{{/let}}</template>',
    '<template><Logs @logs={{this.logs}} as |log|>{{log}}</Logs></template>',
    '<template><Logs @logs={{this.logs}} as |log|><Log>{{log}}</Log></Logs></template>',
  ],

  invalid: [
    {
      code: `<template>
        {{log "debug message"}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected log statement in template.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{#if condition}}
          {{log this.value}}
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected log statement in template.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{#log "test"}}
          content
        {{/log}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected log statement in template.',
          type: 'GlimmerBlockStatement',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{log}}</template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
    {
      code: '<template>{{log "Logs are best for debugging!"}}</template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
    {
      code: '<template>{{#log}}Arrgh!{{/log}}</template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
    {
      code: '<template>{{#log "Foo"}}{{/log}}</template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
    {
      code: '<template>{{#each this.messages as |message|}}{{log message}}{{/each}}</template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
    {
      code: '<template>{{#let this.message as |message|}}{{log message}}{{/let}}</template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
    {
      code: '<template><Messages @messages={{this.messages}} as |message|>{{#log}}{{message}}{{/log}}</Messages></template>',
      output: null,
      errors: [{ message: 'Unexpected log statement in template.' }],
    },
  ],
});
