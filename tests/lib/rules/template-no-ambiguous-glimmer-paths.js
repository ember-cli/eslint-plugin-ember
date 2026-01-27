const rule = require('../../../lib/rules/template-no-ambiguous-glimmer-paths');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-ambiguous-glimmer-paths', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template>{{this.name}}</template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template>{{@title}}</template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template>{{MyComponent}}</template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template>{{if this.isActive "active" "inactive"}}</template>',
      output: null,
    },
  ],

  invalid: [
    {
      filename: 'test.gjs',
      code: '<template>{{user.name}}</template>',
      output: null,
      errors: [
        {
          messageId: 'ambiguousPath',
          data: { path: 'user.name' },
        },
      ],
    },
    {
      filename: 'test.gjs',
      code: '<template>{{model.title}}</template>',
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
