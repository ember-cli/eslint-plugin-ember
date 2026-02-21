const rule = require('../../../lib/rules/template-no-input-tagname');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-input-tagname', rule, {
  valid: ['<template>{{input value=this.foo}}</template>'
    // Test cases ported from ember-template-lint
    '<template>{{input type="text"}}</template>',
    '<template>{{component "input" type="text"}}</template>',
    '<template>{{yield (component "input" type="text")}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{input tagName="span"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{input tagName="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{input tagName=bar}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{component "input" tagName="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{component "input" tagName=bar}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{yield (component "input" tagName="foo")}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{yield (component "input" tagName=bar)}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
