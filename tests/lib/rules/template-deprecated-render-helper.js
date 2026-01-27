const rule = require('../../../lib/rules/template-deprecated-render-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-deprecated-render-helper', rule, {
  valid: [
    '<template><MyComponent /></template>',
    '<template>{{this.render}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{render "user"}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
