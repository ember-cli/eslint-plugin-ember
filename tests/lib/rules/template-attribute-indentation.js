//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-attribute-indentation');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-attribute-indentation', rule, {
  valid: [
    `<template>
      <div class="foo"></div>
    </template>`,
    `<template>
      <MyComponent @arg="value" />
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [],
});
