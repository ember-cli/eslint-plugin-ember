'use strict';

const rule = require('../../../lib/rules/template-no-html-comments');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-no-html-comments', rule, {
  valid: [
    '<template>{{! This is a comment }}</template>',
    '<template>{{!-- This is a comment --}}</template>',
    '<template><div>Content</div></template>',
  ],
  invalid: [
    {
      code: '<template><!-- HTML comment --></template>',
      output: null,
      errors: [{ messageId: 'noHtmlComments' }],
    },
  ],
});
