const rule = require('../../../lib/rules/template-no-ambiguous-glimmer-paths');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-ambiguous-glimmer-paths', rule, {
  valid: [
    {
      code: '<template>{{this.name}}</template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template>{{@title}}</template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template>{{MyComponent}}</template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template>{{if this.isActive "active" "inactive"}}</template>',
      filename: 'test.gjs',
      output: null,
    },
  ],

  invalid: [
    {
      code: '<template>{{user.name}}</template>',
      filename: 'test.gjs',
      output: null,
      errors: [
        {
          messageId: 'ambiguousPath',
          data: { path: 'user.name' },
        },
      ],
    },
    {
      code: '<template>{{model.title}}</template>',
      filename: 'test.gjs',
      output: null,
      errors: [
        {
          messageId: 'ambiguousPath',
          data: { path: 'model.title' },
        },
      ],
    },
  ],
});
