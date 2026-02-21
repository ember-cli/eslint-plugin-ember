const rule = require('../../../lib/rules/template-no-yield-block-params-to-else-inverse');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-yield-block-params-to-else-inverse', rule, {
  valid: [
    '<template>{{yield}}</template>',
    '<template>{{yield "some" "param"}}</template>',
    '<template>{{yield to="whatever"}}</template>',
    '<template>{{yield to=this.someValue}}</template>',
  
    // Test cases ported from ember-template-lint
    '<template>{{yield to=(get some this.map)}}</template>',
    '<template>{{yield to="else"}}</template>',
    '<template>{{yield to="inverse"}}</template>',
    '<template>{{not-yield "some" "param" to="else"}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{yield "some" "param" to="else"}}</template>',
      output: null,
      errors: [
        {
          message: 'Yielding block params to else/inverse block is not allowed',
        },
      ],
    },
    {
      code: '<template>{{yield "some" "param" to="inverse"}}</template>',
      output: null,
      errors: [
        {
          message: 'Yielding block params to else/inverse block is not allowed',
        },
      ],
    },
  ],
});
