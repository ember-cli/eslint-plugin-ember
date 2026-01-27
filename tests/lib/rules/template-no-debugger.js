//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-debugger');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-debugger', rule, {
  valid: [
    `<template>
      <div>Hello World</div>
    </template>`,
    `<template>
      {{this.debug}}
    </template>`,
    `<template>
      {{debugMode}}
    </template>`,
    `<template>
      <div data-test-debugger={{true}}></div>
    </template>`,

    '<template>{{foo}}</template>',
    '<template>{{button}}</template>',
  ],

  invalid: [
    {
      code: `<template>
        {{debugger}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected debugger statement in template.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{#if condition}}
          {{debugger}}
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected debugger statement in template.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{#debugger}}
          content
        {{/debugger}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected debugger statement in template.',
          type: 'GlimmerBlockStatement',
        },
      ],
    },

    {
      code: '<template>{{#debugger}}Invalid!{{/debugger}}</template>',
      output: null,
      errors: [{ message: 'Unexpected debugger statement in template.' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-debugger (hbs)', rule, {
  valid: ['{{foo}}', '{{button}}'],
  invalid: [
    {
      code: '{{debugger}}',
      output: null,
      errors: [{ message: 'Unexpected debugger statement in template.' }],
    },
    {
      code: '{{#debugger}}Invalid!{{/debugger}}',
      output: null,
      errors: [{ message: 'Unexpected debugger statement in template.' }],
    },
  ],
});
