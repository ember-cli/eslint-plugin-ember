const rule = require('../../../lib/rules/template-no-chained-this');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-chained-this', rule, {
  valid: [
    '<template>{{this.user}}</template>',
    '<template>{{userName}}</template>',
    '<template>{{@user}}</template>',
    '<template>{{get this.user "name"}}</template>',
  ],

  invalid: [
    {
      code: '<template>{{this.user.name}}</template>',
      output: null,
      errors: [
        {
          message:
            'Do not chain property access on this (this.user.name). Use local variables or getters instead.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
    {
      code: '<template>{{this.model.user.firstName}}</template>',
      output: null,
      errors: [
        {
          message:
            'Do not chain property access on this (this.model.user.firstName). Use local variables or getters instead.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
    {
      code: '<template><div>{{this.data.items.length}}</div></template>',
      output: null,
      errors: [
        {
          message:
            'Do not chain property access on this (this.data.items.length). Use local variables or getters instead.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
  ],
});
