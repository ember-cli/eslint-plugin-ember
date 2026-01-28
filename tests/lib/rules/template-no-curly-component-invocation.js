const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-curly-component-invocation');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-curly-component-invocation', rule, {
  valid: [
    // Angle bracket invocation
    '<template><MyComponent /></template>',
    '<template><my-component /></template>',
    
    // Helpers are allowed
    '<template>{{some-helper "arg"}}</template>',
    '<template>{{lowercase-helper}}</template>',
    
    // Property access
    '<template>{{this.myComponent}}</template>',
    '<template>{{@myComponent}}</template>',
    
    // Built-in helpers
    '<template>{{yield}}</template>',
    '<template>{{outlet}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{my-component}}</template>',
      output: null,
      errors: [{ messageId: 'noCurlyInvocation' }],
    },
    {
      code: '<template>{{MyComponent}}</template>',
      output: null,
      errors: [{ messageId: 'noCurlyInvocation' }],
    },
    {
      code: '<template>{{my-component arg="value"}}</template>',
      output: null,
      errors: [{ messageId: 'noCurlyInvocation' }],
    },
  ],
});
