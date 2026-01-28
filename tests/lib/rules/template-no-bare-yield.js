'use strict';

const rule = require('../../../lib/rules/template-no-bare-yield');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-no-bare-yield', rule, {
  valid: [
    '<template>{{yield this}}</template>',
    '<template>{{yield @model}}</template>',
    '<template><div>Content</div></template>',
  ],
  invalid: [
    {
      code: '<template>{{yield}}</template>',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
  ],
});
