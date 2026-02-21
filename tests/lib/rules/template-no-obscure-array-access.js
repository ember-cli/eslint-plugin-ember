//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-obscure-array-access');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

// Note: @each and [] are not valid in standard Glimmer templates and cause parse errors
// This rule is designed to catch edge cases or custom syntax if they were to exist
// We'll use simpler valid/invalid cases that actually parse
ruleTester.run('template-no-obscure-array-access', rule, {
  valid: [
    '<template>{{items}}</template>',
    '<template>{{this.items}}</template>',
    '<template>{{#each items as |item|}}{{item.name}}{{/each}}</template>',
    '<template>{{get items 0}}</template>',
    '<template>{{items.firstObject.name}}</template>',
  
    // Test cases ported from ember-template-lint
    "<template>{{foo bar=(get this 'list.0' )}}</template>",
    "<template><Foo @bar={{get this 'list.0'}} /></template>",
    "<template>{{get this 'list.0'}}</template>",
    '<template>{{foo bar @list}}</template>',
    '<template>Just a regular text in the template bar.[1] bar.1</template>',
    '<template><Foo foo="bar.[1]" /></template>',
    `<template><FooBar
    @subHeaderText={{if
      this.isFooBarV2Enabled
      "foobar"
    }}
  /></template>`,
  ],
  invalid: [
    // Since @each and [] cause parse errors, this rule serves as documentation
    // In practice, the parser will catch these issues before the rule runs
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><Foo @onClick={{fn this.func @foo.0.bar}} /></template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
    {
      code: '<template>{{foo bar=this.list.[0]}}</template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
    {
      code: '<template>{{foo bar=@list.[1]}}</template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
    {
      code: '<template>{{this.list.[0]}}</template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
    {
      code: '<template>{{this.list.[0].name}}</template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
    {
      code: '<template><Foo @bar={{this.list.[0]}} /></template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
    {
      code: '<template><Foo @bar={{this.list.[0].name.[1].foo}} /></template>',
      output: null,
      errors: [{ messageId: 'noObscureArrayAccess' }],
    },
  ],
});
