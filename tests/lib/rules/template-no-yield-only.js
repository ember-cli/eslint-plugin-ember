//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-yield-only');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-yield-only', rule, {
  valid: [
    `<template>
      <div>
        {{yield}}
      </div>
    </template>`,
    `<template>
      {{this.something}}
      {{yield}}
    </template>`,
    `<template>
      <div></div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template>{{yield (hash someProp=someValue)}}</template>',
    '<template>{{field}}</template>',
    '<template>{{#yield}}{{/yield}}</template>',
    '<template><Yield/></template>',
    '<template><yield/></template>',
  ],

  invalid: [
    {
      code: `<template>
        {{yield}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
  
        {{yield}}
  
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: '<template>{{yield}}</template>',
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: `<template>
{{! some comment }}  {{yield}}
     </template>`,
      output: null,
      errors: [{ message: 'Component should not only yield. Add wrapper element or additional functionality.' }],
    },
  ],
});
