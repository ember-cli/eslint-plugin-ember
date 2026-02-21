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
  
    // Test cases ported from ember-template-lint
    '<template><a href=""></a></template>',
    '<template><a href="#"></a></template>',
    '<template><a href="javascript:;"></a></template>',
    '<template><a href="http://localhost"></a></template>',
    '<template><a href={{link}}></a></template>',
    '<template><a role="link" aria-disabled="true">valid</a></template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><a></a></template>',
      output: null,
      errors: [{ messageId: 'missingHref' }],
    },
  ],
});
