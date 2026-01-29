const rule = require('../../../lib/rules/template-no-dynamic-subexpression-invocations');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-dynamic-subexpression-invocations', rule, {
  valid: [
    '<template>{{format-date this.date}}</template>',
    '<template>{{(upper-case this.name)}}</template>',
    '<template>{{helper "static"}}</template>',
  ],

  invalid: [
    {
      code: '<template>{{(this.helper "arg")}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use dynamic helper invocations. Use explicit helper names instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template>{{(@helperName "value")}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use dynamic helper invocations. Use explicit helper names instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template>{{this.formatter this.data}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use dynamic helper invocations. Use explicit helper names instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  ],
});
