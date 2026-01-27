const rule = require('../../../lib/rules/template-no-unnecessary-concat');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-unnecessary-concat', rule, {
  valid: ['<template><div class="foo {{bar}}"></div></template>'],
  invalid: [
    { 
      code: '<template><div class="{{foo}}"></div></template>', 
      output: '<template><div class={{foo}}></div></template>',
      errors: [{ messageId: 'unnecessary' }] 
    },
  ],
});
