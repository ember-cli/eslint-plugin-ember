'use strict';

const rule = require('../../../lib/rules/template-no-invalid-aria-attributes');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-no-invalid-aria-attributes', rule, {
  valid: [
    '<template><div aria-label="Label">Content</div></template>',
    '<template><div aria-hidden="true">Content</div></template>',
    '<template><div aria-describedby="id">Content</div></template>',
  ],
  invalid: [
    {
      code: '<template><div aria-fake="value">Content</div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-fake' } }],
    },
    {
      code: '<template><div aria-invalid-attr="value">Content</div></template>',
      output: null,
      errors: [
        { messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-invalid-attr' } },
      ],
    },
  ],
});
