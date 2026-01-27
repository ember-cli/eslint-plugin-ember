//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-invalid-aria-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

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
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-invalid-attr' } }],
    },
  ],
});
