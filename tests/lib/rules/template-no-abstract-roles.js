const rule = require('../../../lib/rules/template-no-abstract-roles');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-abstract-roles', rule, {
  valid: ['<template><div role="button"></div></template>', '<template><div></div></template>'
    // Test cases ported from ember-template-lint
    '<template><img alt="" role="none" src="zoey.jpg"></template>',
    '<template><img alt="" role="presentation" src="zoey.jpg"></template>',
  ],
  invalid: [
    {
      code: '<template><div role="command"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="widget"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><img role="command"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="composite"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><input role="input"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="landmark"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><input role="range"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="roletype"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="section"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="sectionhead"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><select role="select"></select></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="structure"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="widget"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="window"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
  ],
});
