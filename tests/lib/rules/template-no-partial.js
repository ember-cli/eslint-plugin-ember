//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-partial');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-partial', rule, {
  valid: [
    `<template>
      <MyComponent />
    </template>`,
    `<template>
      {{this.partial}}
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{partial "user-info"}}
      </template>`,
      output: null,
      errors: [{
        message: 'Unexpected partial usage. Partials are deprecated, use components instead.',
        type: 'GlimmerMustacheStatement',
      }],
    },
    {
      code: `<template>
        <div>
          {{partial "header"}}
        </div>
      </template>`,
      output: null,
      errors: [{
        type: 'GlimmerMustacheStatement',
      }],
    },
  ],
});
