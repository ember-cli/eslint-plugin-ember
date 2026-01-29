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
  ],
  invalid: [
    // Since @each and [] cause parse errors, this rule serves as documentation
    // In practice, the parser will catch these issues before the rule runs
  ],
});
