const rule = require('../../../lib/rules/template-deprecated-inline-view-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-deprecated-inline-view-helper', rule, {
  valid: ['<template><MyComponent /></template>', '<template>{{view}}</template>'
    // Test cases ported from ember-template-lint
    '<template>{{great-fishsticks}}</template>',
    '<template>{{input placeholder=(t "email") value=email}}</template>',
    '<template>{{title "CrossCheck Web" prepend=true separator=" | "}}</template>',
    '<template>{{false}}</template>',
    '<template>{{"foo"}}</template>',
    '<template>{{42}}</template>',
    '<template>{{null}}</template>',
    '<template>{{undefined}}</template>',
    '<template>{{has-block "view"}}</template>',
    '<template>{{yield to="view"}}</template>',
    '<template>{{#if (has-block "view")}}{{yield to="view"}}{{/if}}</template>',
    '<template>{{this.view}}</template>',
    '<template>{{@view}}</template>',
    '<template>{{#let this.prop as |view|}} {{view}} {{/let}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{view class="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: "<template>{{view 'awful-fishsticks'}}</template>",
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{view.bad-fishsticks}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{view.terrible.fishsticks}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{foo-bar bab=good baz=view.qux.qaz boo=okay}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template><div class="whatever-class" data-foo={{view.hallo}} sure=thing></div></template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{#foo-bar derp=view.whoops thing=whatever}}{{/foo-bar}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
