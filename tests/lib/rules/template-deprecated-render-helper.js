const rule = require('../../../lib/rules/template-deprecated-render-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-deprecated-render-helper', rule, {
  valid: ['<template><MyComponent /></template>', '<template>{{this.render}}</template>'
    // Test cases ported from ember-template-lint
    '<template>{{valid-compoennt}}</template>',
    '<template>{{input placeholder=(t "email") value=email}}</template>',
    '<template>{{title "CrossCheck Web" prepent=true separator=" | "}}</template>',
    '<template>{{hockey-player teamName="Boston Bruins"}}</template>',
    '<template>{{false}}</template>',
    '<template>{{"foo"}}</template>',
    '<template>{{42}}</template>',
    '<template>{{null}}</template>',
    '<template>{{undefined}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{render "user"}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: "<template>{{render 'ken-griffey'}}</template>",
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: "<template>{{render 'baseball-player' pitcher}}</template>",
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
