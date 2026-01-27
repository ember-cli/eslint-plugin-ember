const rule = require('../../../lib/rules/template-no-valueless-arguments');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-valueless-arguments', rule, {
  valid: ['<template><Foo @bar={{true}} /></template>'],
  invalid: [
    { code: '<template><Foo @bar /></template>', errors: [{ messageId: 'valueless' }] },
  ],
});
