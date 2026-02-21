const rule = require('../../../lib/rules/template-no-inline-styles');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-inline-styles', rule, {
  valid: ['<template><div class="foo"></div></template>'
    // Test cases ported from ember-template-lint
    '<template><div></div></template>',
    '<template><span></span></template>',
    '<template><ul class="dummy"></ul></template>',
    '<template><div style={{foo}}></div></template>',
    '<template><div style={{html-safe (concat "background-image: url(" url ")")}}></div></template>',
  ],
  invalid: [
    {
      code: '<template><div style="color: red"></div></template>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
  ],
});
