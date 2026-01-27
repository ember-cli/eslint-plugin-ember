//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unnecessary-curly-parens');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unnecessary-curly-parens', rule, {
  valid: [
    '<template>{{helper param}}</template>',
    '<template>{{#if condition}}text{{/if}}</template>',
    '<template>{{this.property}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{value}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template>{{name}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template>{{count}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
  ],
});
