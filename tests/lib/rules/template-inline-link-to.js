const rule = require('../../../lib/rules/template-inline-link-to');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-inline-link-to', rule, {
  valid: [
    "<template>{{#link-to 'routeName' prop}}Link text{{/link-to}}</template>",
    "<template>{{#link-to 'routeName'}}Link text{{/link-to}}</template>",
  ],
  invalid: [
    {
      code: "<template>{{link-to 'Link text' 'routeName'}}</template>",
      output: "<template>{{#link-to 'routeName'}}Link text{{/link-to}}</template>",
      errors: [
        {
          message: 'The inline form of link-to is not allowed. Use the block form instead.',
        },
      ],
    },
    {
      code: "<template>{{link-to 'Link text' 'routeName' one two}}</template>",
      output: "<template>{{#link-to 'routeName' one two}}Link text{{/link-to}}</template>",
      errors: [
        {
          message: 'The inline form of link-to is not allowed. Use the block form instead.',
        },
      ],
    },
    {
      code: "<template>{{link-to (concat 'Hello' @username) 'routeName' one two}}</template>",
      output:
        "<template>{{#link-to 'routeName' one two}}{{concat 'Hello' @username}}{{/link-to}}</template>",
      errors: [
        {
          message: 'The inline form of link-to is not allowed. Use the block form instead.',
        },
      ],
    },
    {
      code: "<template>{{link-to 1234 'routeName' one two}}</template>",
      output: null,
      errors: [
        {
          message: 'The inline form of link-to is not allowed. Use the block form instead.',
        },
      ],
    },
  ],
});
