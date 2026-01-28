//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-linebreak-style');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-linebreak-style', rule, {
  valid: [
    `<template>
      <div>Content</div>
    </template>`,
    `<template>
      <div></div>
    </template>`,
    `<template><div></div></template>`,
  ],

  invalid: [],
});
