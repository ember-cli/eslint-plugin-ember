const rule = require('../../../lib/rules/template-no-valueless-arguments');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-valueless-arguments', rule, {
  valid: ['<template><Foo @bar={{true}} /></template>'
    // Test cases ported from ember-template-lint
    '<template><SomeComponent @emptyString="" data-test-some-component /></template>',
    '<template><button type="submit" disabled {{on "click" this.submit}}></button></template>',
  ],
  invalid: [
    {
      code: '<template><Foo @bar /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><SomeComponent @valueless /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
    {
      code: '<template><SomeComponent @valuelessByAccident{{this.canBeAModifier}} /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
    {
      code: '<template><SomeComponent @valuelessByAccident{{@canBeAModifier}} /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
  ],
});
