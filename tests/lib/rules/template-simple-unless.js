'use strict';

const rule = require('../../../lib/rules/template-simple-unless');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-simple-unless', rule, {
  valid: [
    '<template>{{#unless isHidden}}Show{{/unless}}</template>',
    '<template>{{#unless @disabled}}Enabled{{/unless}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#unless (eq value 1)}}Not one{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'simpleUnless' }],
    },
    {
      code: '<template>{{#unless (or a b)}}Neither{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'simpleUnless' }],
    },
  ],
});
