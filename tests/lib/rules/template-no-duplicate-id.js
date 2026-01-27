const rule = require('../../../lib/rules/template-no-duplicate-id');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-duplicate-id', rule, {
  valid: ['<template><div id="a"></div><div id="b"></div></template>'],
  invalid: [
    { code: '<template><div id="foo"></div><div id="foo"></div></template>', errors: [{ messageId: 'duplicate' }] },
  ],
});
