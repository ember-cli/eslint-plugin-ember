const rule = require('../../../lib/rules/template-link-rel-noopener');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-link-rel-noopener', rule, {
  valid: ['<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>'],
  invalid: [
    {
      code: '<template><a href="/" target="_blank">Link</a></template>',
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
  ],
});
