const rule = require('../../../lib/rules/template-no-restricted-invocations');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-restricted-invocations', rule, {
  valid: [
    {
      code: '<template>{{baz}}</template>',
      output: null,
      options: [['foo', 'bar']],
    },
    {
      code: '<template>{{baz foo=bar}}</template>',
      output: null,
      options: [['foo', 'bar']],
    },
    {
      code: '<template>{{#baz}}{{/baz}}</template>',
      output: null,
      options: [['foo', 'bar']],
    },
    {
      code: '<template>{{component "baz"}}</template>',
      output: null,
      options: [['foo', 'bar']],
    },
    {
      code: '<template>{{other-component}}</template>',
      output: null,
      options: [['foo', 'bar']],
    },
    {
      code: '<template><RandomComponent /></template>',
      output: null,
      options: [['foo', 'bar']],
    },
    {
      code: '<template></template>',
      output: null,
      options: [['foo', 'bar']],
    },
  ],
  invalid: [
    {
      code: '<template>{{foo}}</template>',
      output: null,
      options: [['foo', 'bar']],
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{foo}}'",
        },
      ],
    },
    {
      code: '<template>{{#foo}}{{/foo}}</template>',
      output: null,
      options: [['foo', 'bar']],
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{#foo}}'",
        },
      ],
    },
    {
      code: '<template><Foo /></template>',
      output: null,
      options: [['foo', 'bar']],
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '<Foo />'",
        },
      ],
    },
    {
      code: '<template>{{bar foo=bar}}</template>',
      output: null,
      options: [['foo', 'bar']],
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{bar}}'",
        },
      ],
    },
    {
      code: '<template>{{deprecated-component}}</template>',
      output: null,
      options: [
        [
          'foo',
          {
            names: ['deprecated-component'],
            message: 'Use new-component instead',
          },
        ],
      ],
      errors: [
        {
          message: 'Use new-component instead',
        },
      ],
    },
  ],
});
