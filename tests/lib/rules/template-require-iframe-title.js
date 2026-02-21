const rule = require('../../../lib/rules/template-require-iframe-title');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-iframe-title', rule, {
  valid: [
    '<template><iframe title="Video"></iframe></template>',
    '<template><iframe title="Map" src="/map"></iframe></template>',
    '<template><iframe aria-hidden="true"></iframe></template>',
    '<template><iframe hidden></iframe></template>',
  
    // Test cases ported from ember-template-lint
    '<template><iframe title="Welcome to the Matrix!" /></template>',
    '<template><iframe title={{someValue}} /></template>',
    '<template><iframe title="" aria-hidden /></template>',
    '<template><iframe title="" hidden /></template>',
    '<template><iframe title="foo" /><iframe title="bar" /></template>',
  ],
  invalid: [
    {
      code: '<template><iframe src="/content"></iframe></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe title=""></iframe></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><iframe title="foo" /><iframe title="foo" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe title="foo" /><iframe title="boo" /><iframe title="foo" /><iframe title="boo" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title={{false}} /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title="{{false}}" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title="" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
  ],
});
