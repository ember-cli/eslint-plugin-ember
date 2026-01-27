const rule = require('../../../lib/rules/template-no-with');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-with', rule, {
  valid: ['<template>{{#let foo as |bar|}}{{bar}}{{/let}}</template>'],
  invalid: [
    { code: '<template>{{#with foo as |bar|}}{{bar}}{{/with}}</template>', errors: [{ messageId: 'deprecated' }] },
  ],
});
