const rule = require('../../../lib/rules/template-no-input-block');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-input-block', rule, {
  valid: [
    '<template>{{input value=this.foo}}</template>',
    '<template>{{button}}</template>',
    '<template>{{#x-button}}{{/x-button}}</template>',
    '<template>{{input}}</template>',

    // GJS/GTS: the classic `{{input}}` helper is HBS-only — `input` is not
    // an ambient strict-mode keyword. Any `{{#input}}` in strict mode is a
    // user-imported binding (or an unbound name that the strict-mode
    // compiler will reject on its own); flagging here would corrupt the
    // user's intent for the imported case.
    {
      filename: 'test.gjs',
      code: '<template>{{#input}}content{{/input}}</template>',
    },
    {
      filename: 'test.gts',
      code: '<template>{{#input}}content{{/input}}</template>',
    },
    {
      filename: 'test.gjs',
      code: "import input from './my-input';\n<template>{{#input}}content{{/input}}</template>",
    },
    {
      filename: 'test.gjs',
      code: "import input from './my-input';\n<template>{{#input value=this.foo}}{{/input}}</template>",
    },
  ],
  invalid: [
    {
      code: '<template>{{#input}}{{/input}}</template>',
      output: null,
      errors: [{ messageId: 'blockUsage' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-input-block', rule, {
  valid: ['{{button}}', '{{#x-button}}{{/x-button}}', '{{input}}'],
  invalid: [
    {
      code: '{{#input}}{{/input}}',
      output: null,
      errors: [{ message: 'Unexpected block usage. The input helper may only be used inline.' }],
    },
  ],
});
