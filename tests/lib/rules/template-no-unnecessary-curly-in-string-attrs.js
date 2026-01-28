'use strict';

const rule = require('../../../lib/rules/template-no-unnecessary-curly-in-string-attrs');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-no-unnecessary-curly-in-string-attrs', rule, {
  valid: [
    '<template><div class="static">Text</div></template>',
    '<template><div class={{this.dynamic}}>Text</div></template>',
  ],
  invalid: [
    {
      code: '<template><div class={{"static"}}>Text</div></template>',
      output: null,
      errors: [{ messageId: 'unnecessaryCurlyInStringAttr' }],
    },
  ],
});
