//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-outlet-outside-routes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-outlet-outside-routes', rule, {
  valid: ['<template><div>Content</div></template>'
    // Test cases ported from ember-template-lint
    '<template>{{foo}}</template>',
    '<template>{{button}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{outlet}}</template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    {
      code: '<template><div>{{outlet}}</div></template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
  ],
});
