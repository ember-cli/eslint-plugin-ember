const rule = require('../../../lib/rules/template-no-block-params');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-block-params', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template><MyComponent>Content</MyComponent></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><MyComponent as |item|>{{item.name}}</MyComponent></template>',
      output: null,
    },
  ],

  invalid: [
    // Note: This rule requires runtime analysis to know if component yields
    // Simplified implementation for now
  ],
});
