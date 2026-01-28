'use strict';

const rule = require('../../../lib/rules/template-no-invalid-link-title');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-no-invalid-link-title', rule, {
  valid: [
    '<template><a href="/page" title="More information about page">Page</a></template>',
    '<template><a href="/page">Page</a></template>',
    '<template><a href="/page" title={{dynamic}}>Page</a></template>',
  ],
  invalid: [
    {
      code: '<template><a href="/page" title="">Page</a></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><a href="/page" title="Page">Page</a></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
  ],
});
