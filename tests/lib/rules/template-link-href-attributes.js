const rule = require('../../../lib/rules/template-link-href-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-link-href-attributes', rule, {
  valid: [
    '<template><a href="/about">About</a></template>',
    '<template><a href="https://example.com">External</a></template>',
    '<template><button>Click me</button></template>',
  ],

  invalid: [
    {
      code: '<template><a>Link</a></template>',
      output: null,
      errors: [{ messageId: 'missingHref' }],
    },
    {
      code: '<template><a onclick="doSomething()">Click</a></template>',
      output: null,
      errors: [{ messageId: 'missingHref' }],
    },
    {
      code: '<template><a role="button">Action</a></template>',
      output: null,
      errors: [{ messageId: 'missingHref' }],
    },
  ],
});
