const rule = require('../../../lib/rules/template-no-attrs-in-components');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-attrs-in-components', rule, {
  valid: ['<template>{{@value}}</template>', '<template>{{this.value}}</template>'],
  invalid: [
    {
      code: '<template>{{attrs.value}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    {
      code: '<template>{{attrs}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
  ],
});
