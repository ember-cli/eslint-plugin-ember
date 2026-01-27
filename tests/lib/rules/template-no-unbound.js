const rule = require('../../../lib/rules/template-no-unbound');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-unbound', rule, {
  valid: ['<template>{{this.value}}</template>'],
  invalid: [
    {
      code: '<template>{{unbound foo}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
