//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-simple-unless');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-simple-unless', rule, {
  valid: [
    '<template>{{#unless isHidden}}Show{{/unless}}</template>',
    '<template>{{#unless @disabled}}Enabled{{/unless}}</template>',
  
    // Test cases ported from ember-template-lint
    "<template>{{#unless isRed}}I'm blue, da ba dee da ba daa{{/unless}}</template>",
    `<template><div class="{{unless foo 'no-foo'}}"></div></template>`,
    `<template><div class="{{if foo 'foo'}}"></div></template>`,
    '<template>{{unrelated-mustache-without-params}}</template>',
    '<template>{{#if foo}}{{else}}{{/if}}</template>',
    '<template>{{#if foo}}{{else}}{{#unless bar}}{{/unless}}{{/if}}</template>',
    '<template>{{#if foo}}{{else}}{{unless bar someProperty}}{{/if}}</template>',
    '<template>{{#unless (or foo bar)}}order whiskey{{/unless}}</template>',
    '<template>{{#unless (eq (or foo bar) baz)}}order whiskey{{/unless}}</template>',
    '<template>{{#unless hamburger}}\\n  HOT DOG!\\n{{/unless}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#unless (eq value 1)}}Not one{{/unless}}</template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template>{{#unless (or a b)}}Neither{{/unless}}</template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: "<template>{{unless (if true)  'Please no'}}</template>",
      output: null,
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: "<template>{{unless (and isBad isAwful)  'notBadAndAwful'}}</template>",
      output: null,
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template><img class={{unless (not condition) "some-class"}}></template>',
      output: null,
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template><img class={{unless (one condition) "some-class" "other-class"}}></template>',
      output: null,
      errors: [{ messageId: 'withHelper' }],
    },
  ],
});
