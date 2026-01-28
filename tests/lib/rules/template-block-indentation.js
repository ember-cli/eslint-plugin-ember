//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-block-indentation');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-block-indentation', rule, {
  valid: [
    `<template>
      <div>Content</div>
    </template>`,
    `<template>
      {{#if condition}}
        <div>Content</div>
      {{/if}}
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [],
});
