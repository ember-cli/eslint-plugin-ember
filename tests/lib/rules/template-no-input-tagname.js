const rule = require('../../../lib/rules/template-no-input-tagname');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-input-tagname', rule, {
  valid: ['<template>{{input value=this.foo}}</template>'],
  invalid: [
    {
      code: '<template>{{input tagName="span"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
