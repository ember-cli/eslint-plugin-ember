//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-trailing-spaces');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-trailing-spaces', rule, {
  valid: [
    `<template>
      <div>Hello World</div>
    </template>`,
    `<template>
      <div>
        Content
      </div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template> 
      <div>Hello</div>
    </template>`,
      output: `<template>
      <div>Hello</div>
    </template>`,
      errors: [
        {
          message: 'Trailing whitespace detected.',
        },
      ],
    },
    {
      code: `<template>
      <div>Hello</div>  
    </template>`,
      output: `<template>
      <div>Hello</div>
    </template>`,
      errors: [
        {
          message: 'Trailing whitespace detected.',
        },
      ],
    },
  ],
});
