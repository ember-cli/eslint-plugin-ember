//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-simple-unless');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-simple-unless', rule, {
  valid: [
    '<template>{{#unless isHidden}}Show{{/unless}}</template>',
    '<template>{{#unless @disabled}}Enabled{{/unless}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#unless (eq value 1)}}Not one{{/unless}}</template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template>{{#unless (or a b)}}Neither{{/unless}}</template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
  ],
});
