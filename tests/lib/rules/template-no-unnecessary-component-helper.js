const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-unnecessary-component-helper');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unnecessary-component-helper', rule, {
  valid: [
    // Angle bracket invocation
    '<template><MyComponent /></template>',

    // Dynamic component names (necessary use)
    '<template>{{component this.componentName}}</template>',
    '<template>{{component @componentName}}</template>',

    // No component helper
    '<template>{{my-helper}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{component "my-component"}}</template>',
      output: '<template>{{my-component}}</template>',
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
    {
      code: '<template>{{component "MyComponent"}}</template>',
      output: '<template>{{MyComponent}}</template>',
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{component "my-component-name" foo=123 bar=456}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
    {
      code: '<template>{{#component "my-component-name" foo=123 bar=456}}{{/component}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
    {
      code: '<template><Foo @arg={{component "allowed-component"}}>{{component "forbidden-component"}}</Foo></template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
  ],
});
