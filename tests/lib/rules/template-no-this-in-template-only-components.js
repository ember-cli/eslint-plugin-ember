const rule = require('../../../lib/rules/template-no-this-in-template-only-components');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-this-in-template-only-components', rule, {
  valid: ['<template>{{@foo}}</template>'],
  invalid: [
    { code: '<template>{{this.foo}}</template>', errors: [{ messageId: 'noThis' }] },
  ],
});
