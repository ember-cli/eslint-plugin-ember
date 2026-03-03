//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-quotes');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-quotes', rule, {
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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-quotes', rule, {
  valid: ['{{component "test"}}', '{{hello x="test"}}', '<input type="checkbox">'],
  invalid: [
    {
      code: "{{component 'one {{thing}} two'}}",
      output: '{{component "one {{thing}} two"}}',
      errors: [{ message: 'you must use double quotes in templates' }],
    },
    {
      code: '<img class=\'a "so-called" btn {{this.otherClass}}\'>',
      output: null,
      errors: [{ message: 'you must use double quotes in templates' }],
    },
  ],
});
