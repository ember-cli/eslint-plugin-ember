const rule = require('../../../lib/rules/template-no-input-block');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-input-block', rule, {
  valid: ['<template>{{input value=this.foo}}</template>'
    // Test cases ported from ember-template-lint
    '<template>{{button}}</template>',
    '<template>{{#x-button}}{{/x-button}}</template>',
    '<template>{{input}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#input}}{{/input}}</template>',
      output: null,
      errors: [{ messageId: 'blockUsage' }],
    },
  ],
});
