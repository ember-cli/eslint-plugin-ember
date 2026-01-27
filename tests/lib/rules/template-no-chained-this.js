const rule = require('../../../lib/rules/template-no-chained-this');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-chained-this', rule, {
  valid: [
    '<template>{{this.value}}</template>',
    '<template>{{this.thisvalue}}</template>',
    '<template>{{@argName}}</template>',
    '<template>{{this.user.name}}</template>',
    '<template><this.Component /></template>',
    '<template>{{component this.dynamicComponent}}</template>',
  ],

  invalid: [
    {
      code: '<template>{{this.this.value}}</template>',
      output: '<template>{{this.value}}</template>',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '<template>{{helper value=this.this.foo}}</template>',
      output: '<template>{{helper value=this.foo}}</template>',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '<template>{{#if this.this.condition}}true{{/if}}</template>',
      output: '<template>{{#if this.condition}}true{{/if}}</template>',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '<template><this.this.Component /></template>',
      output: '<template><this.Component /></template>',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '<template>{{#this.this.value}}woo{{/this.this.value}}</template>',
      output: '<template>{{#this.value}}woo{{/this.value}}</template>',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '<template>{{component this.this.dynamicComponent}}</template>',
      output: '<template>{{component this.dynamicComponent}}</template>',
      errors: [{ messageId: 'noChainedThis' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-chained-this (hbs)', rule, {
  valid: [
    '{{this.value}}',
    '{{this.thisvalue}}',
    '<this.Component />',
    '{{component this.dynamicComponent}}',
    '{{@argName}}',
  ],
  invalid: [
    {
      code: '{{this.this.value}}',
      output: '{{this.value}}',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '{{#this.this.value}}woo{{/this.this.value}}',
      output: '{{#this.value}}woo{{/this.value}}',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '{{helper value=this.this.foo}}',
      output: '{{helper value=this.foo}}',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '<this.this.Component />',
      output: '<this.Component />',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '{{#if this.this.condition}}true{{/if}}',
      output: '{{#if this.condition}}true{{/if}}',
      errors: [{ messageId: 'noChainedThis' }],
    },
    {
      code: '{{component this.this.dynamicComponent}}',
      output: '{{component this.dynamicComponent}}',
      errors: [{ messageId: 'noChainedThis' }],
    },
  ],
});
