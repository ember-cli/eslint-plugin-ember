const rule = require('../../../lib/rules/template-no-unbound');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-unbound', rule, {
  valid: [
    '<template>{{this.value}}</template>',
    '<template>{{foo}}</template>',
    '<template>{{button}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{unbound foo}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },

    {
      code: '<template>{{my-thing foo=(unbound foo)}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
