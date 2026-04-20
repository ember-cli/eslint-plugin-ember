const rule = require('../../../lib/rules/template-no-abstract-roles');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-abstract-roles', rule, {
  valid: ['<template><div role="button"></div></template>', '<template><div></div></template>'],
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
    {
      code: '<template><div role="composite"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><input role="input" /></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="landmark"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><input role="range" /></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="roletype"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="section"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="sectionhead"></div></template>',
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
      code: '<template><div role="window"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
  ],
});
