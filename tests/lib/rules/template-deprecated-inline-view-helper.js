const rule = require('../../../lib/rules/template-deprecated-inline-view-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-deprecated-inline-view-helper', rule, {
  valid: ['<template><MyComponent /></template>', '<template>{{view}}</template>'],
  invalid: [
    {
      code: '<template>{{view class="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
