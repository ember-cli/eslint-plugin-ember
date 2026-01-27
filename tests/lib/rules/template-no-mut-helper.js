const rule = require('../../../lib/rules/template-no-mut-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-mut-helper', rule, {
  valid: [
    '<template><Input @value={{this.name}} @onChange={{this.updateName}} /></template>',
    '<template>{{this.mut}}</template>',
    '<template>{{@mut}}</template>',
    '<template>{{set this "property" value}}</template>',
  ],

  invalid: [
    {
      code: '<template><Input @value={{this.name}} @onChange={{(mut this.name)}} /></template>',
      output: null,
      errors: [
        {
          message: 'Do not use the (mut) helper. Use regular setters or actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template>{{input value=(mut this.name)}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use the (mut) helper. Use regular setters or actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template><CustomComponent @onChange={{(mut this.value)}} /></template>',
      output: null,
      errors: [
        {
          message: 'Do not use the (mut) helper. Use regular setters or actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
  ],
});
