//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-negated-condition');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-negated-condition', rule, {
  valid: [
    '<template>{{#if isValid}}Yes{{/if}}</template>',
    '<template>{{#unless isInvalid}}Yes{{/unless}}</template>',
    '<template>{{#if (eq value 1)}}Yes{{/if}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#if (not isValid)}}No{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'noNegatedCondition' }],
    },
  ],
});
