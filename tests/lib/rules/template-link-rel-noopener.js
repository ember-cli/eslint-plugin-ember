const rule = require('../../../lib/rules/template-link-rel-noopener');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-link-rel-noopener', rule, {
  valid: ['<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>'
    // Test cases ported from ember-template-lint
    '<template><a href="/some/where"></a></template>',
    '<template><a href="/some/where" target="_self"></a></template>',
    '<template><a href="/some/where" target="_blank" rel="noopener noreferrer"></a></template>',
    '<template><a href="/some/where" target="_blank" rel="noreferrer noopener"></a></template>',
    '<template><a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="nofollow noopener noreferrer"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noopener nofollow noreferrer"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer nofollow"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="nofollow noreferrer noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noreferrer nofollow noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a></template>',
  ],
  invalid: [
    {
      code: '<template><a href="/" target="_blank">Link</a></template>',
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><a href="/some/where" target="_blank"></a></template>',
      output: null,
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<template><a href="/some/where" target="_blank" rel="nofollow"></a></template>',
      output: null,
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<template><a href="/some/where" target="_blank" rel="noopener"></a></template>',
      output: null,
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<template><a href="/some/where" target="_blank" rel="noreferrer"></a></template>',
      output: null,
      errors: [{ messageId: 'missingRel' }],
    },
  ],
});
