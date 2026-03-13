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
    '<template><a role="link" aria-disabled="true">valid</a></template>',
    '<template><a role="button" aria-disabled="true">valid</a></template>',
    '<template><a href="">Empty href</a></template>',
    '<template><a href="#">Hash href</a></template>',
    '<template><a href={{this.link}}>Dynamic href</a></template>',
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
    {
      code: '<template><a aria-disabled="true">Disabled only</a></template>',
      output: null,
      errors: [{ messageId: 'missingHref' }],
    },
  ],
});
