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
      output: null,
      errors: [{ messageId: 'noChainedThis' }],
    },
  ],
});
