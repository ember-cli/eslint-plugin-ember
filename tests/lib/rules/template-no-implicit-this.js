const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-implicit-this');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-implicit-this', rule, {
  valid: [
    // Explicit this
    '<template>{{this.property}}</template>',
    '<template>{{this.method}}</template>',

    // Named arguments
    '<template>{{@arg}}</template>',
    '<template>{{@myArg}}</template>',

    // Built-in helpers
    '<template>{{yield}}</template>',
    '<template>{{outlet}}</template>',
    '<template>{{has-block}}</template>',

    // Helpers with params
    '<template>{{if condition "yes" "no"}}</template>',
    '<template>{{each items}}</template>',

    // Helpers with dashes
    '<template>{{my-helper}}</template>',

    // Components (PascalCase)
    '<template>{{MyComponent}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{property}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{someValue}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template><div>{{property}}</div></template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
  ],
});
