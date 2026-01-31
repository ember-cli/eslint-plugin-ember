const rule = require('../../../lib/rules/template-no-invalid-link-text');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-link-text', rule, {
  valid: [
    '<template><a href="/about">About Us</a></template>',
    '<template><a href="/contact">Contact Information</a></template>',
    '<template><a href="/docs" aria-label="Documentation">Click here</a></template>',
  ],

  invalid: [
    {
      code: '<template><a href="/page">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a href="/page">Here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a href="/page">Read more</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
  ],
});
