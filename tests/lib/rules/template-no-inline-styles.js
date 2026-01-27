const rule = require('../../../lib/rules/template-no-inline-styles');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-inline-styles', rule, {
  valid: ['<template><div class="foo"></div></template>'],
  invalid: [
    { code: '<template><div style="color: red"></div></template>', errors: [{ messageId: 'noInlineStyles' }] },
  ],
});
