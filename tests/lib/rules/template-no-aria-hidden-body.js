const rule = require('../../../lib/rules/template-no-aria-hidden-body');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-aria-hidden-body', rule, {
  valid: [
    '<template><body></body></template>',
    '<template><div aria-hidden="true"></div></template>',
  
    // Test cases ported from ember-template-lint
    '<template><body><h1>Hello world</h1></body></template>',
    '<template><body><p aria-hidden="true">Some things are better left unsaid</p></body></template>',
  ],
  invalid: [
    {
      code: '<template><body aria-hidden="true"></body></template>',
      output: '<template><body></body></template>',
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><body aria-hidden></body></template>',
      output: `<template><body></body></template>`,
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
  ],
});
