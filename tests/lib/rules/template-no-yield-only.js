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
  ],
});
