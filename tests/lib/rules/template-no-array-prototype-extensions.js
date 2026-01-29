const rule = require('../../../lib/rules/template-no-array-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-array-prototype-extensions', rule, {
  valid: [
    '<template>{{this.items.[0]}}</template>',
    '<template>{{get this.items 0}}</template>',
    '<template>{{this.users}}</template>',
    '<template>{{@items}}</template>',
    '<template>{{firstObject}}</template>',
    '<template>{{length}}</template>',
  ],

  invalid: [
    {
      code: '<template>{{this.items.firstObject}}</template>',
      output: null,
      errors: [
        {
          message:
            'Do not use Ember Array prototype extension "firstObject". Use native array methods or computed properties instead.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
    {
      code: '<template>{{this.users.lastObject}}</template>',
      output: null,
      errors: [
        {
          message:
            'Do not use Ember Array prototype extension "lastObject". Use native array methods or computed properties instead.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
    {
      code: '<template>{{items.length}}</template>',
      output: null,
      errors: [
        {
          message:
            'Do not use Ember Array prototype extension "length". Use native array methods or computed properties instead.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
  ],
});
