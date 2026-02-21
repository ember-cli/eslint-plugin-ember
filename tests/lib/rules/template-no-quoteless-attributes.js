const rule = require('../../../lib/rules/template-no-quoteless-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-quoteless-attributes', rule, {
  valid: ['<template><div class="foo"></div></template>'
    // Test cases ported from ember-template-lint
    '<template><div data-foo="derp"></div></template>',
    '<template><div data-foo="derp {{stuff}}"></div></template>',
    '<template><div data-foo={{someValue}}></div></template>',
    '<template><div data-foo={{true}}></div></template>',
    '<template><div data-foo={{false}}></div></template>',
    '<template><div data-foo={{5}}></div></template>',
    '<template><SomeThing ...attributes /></template>',
    '<template><div></div></template>',
    '<template><input disabled></template>',
  ],
  invalid: [
    {
      code: '<template><div class=foo></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [{ messageId: 'missing' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div data-foo=asdf></div></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><SomeThing @blah=asdf /></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
  ],
});
