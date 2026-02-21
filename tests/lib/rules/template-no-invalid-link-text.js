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
  
    // Test cases ported from ember-template-lint
    '<template><a href="https://myurl.com">Click here to read more about this amazing adventure</a></template>',
    '<template>{{#link-to}} click here to read more about our company{{/link-to}}</template>',
    '<template><LinkTo>Read more about ways semantic HTML can make your code more accessible.</LinkTo></template>',
    '<template><LinkTo>{{foo}} more</LinkTo></template>',
    '<template><a href="https://myurl.com" aria-labelledby="some-id"></a></template>',
    '<template><a href="https://myurl.com" aria-label="click here to read about our company"></a></template>',
    '<template><a href="https://myurl.com" aria-hidden="true"></a></template>',
    '<template><a href="https://myurl.com" hidden></a></template>',
    '<template><LinkTo aria-label={{t "some-translation"}}>A link with translation</LinkTo></template>',
    '<template><a href="#" aria-label={{this.anAriaLabel}}>A link with a variable as aria-label</a></template>',
  ],

  invalid: [
    {
      code: '<template><a href="/page">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a href="/page">More info</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a href="/page">Read more</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><a href="https://myurl.com">click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><LinkTo>click here</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template>{{#link-to}}click here{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a href="https://myurl.com"></a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a href="https://myurl.com"> </a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: `<template><a href="https://myurl.com"> &nbsp; 
</a></template>`,
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a aria-labelledby="" href="https://myurl.com">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a aria-labelledby=" " href="https://myurl.com">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><a aria-label="Click here" href="https://myurl.com">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template><LinkTo></LinkTo></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: `<template><LinkTo> &nbsp; 
</LinkTo></template>`,
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<template>{{#link-to}}{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: `<template>{{#link-to}} &nbsp; 
{{/link-to}}</template>`,
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
  ],
});
