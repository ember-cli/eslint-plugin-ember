//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unnecessary-service-injection-argument');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unnecessary-service-injection-argument', rule, {
  valid: [
    `<template>
      <div>{{this.store}}</div>
    </template>`,
    `<template>
      {{this.myService}}
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{service "store"}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Service injection argument is unnecessary when it matches the property name.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{service "my-service"}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Service injection argument is unnecessary when it matches the property name.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{service "router"}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Service injection argument is unnecessary when it matches the property name.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  ],
});
