const rule = require('../../../lib/rules/template-no-with');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-with', rule, {
  valid: [
    '<template>{{#let foo as |bar|}}{{bar}}{{/let}}</template>',
    '<template>{{@with}}</template>',
    '<template>{{this.with}}</template>',
    '<template>{{with "foo" bar="baz"}}</template>',
    '<template>{{#if @model.posts}}{{@model.posts}}{{/if}}</template>',
    '<template>{{#let @model.posts as |blogPosts|}}{{blogPosts}}{{/let}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#with foo as |bar|}}{{bar}}{{/with}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },

    {
      code: '<template>{{#with this.foo as |bar|}}{{bar}}{{/with}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{#with (hash firstName="John" lastName="Doe") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-with', rule, {
  valid: [
    '{{@with}}',
    '{{this.with}}',
    '{{with "foo" bar="baz"}}',
    '{{#if @model.posts}}{{@model.posts}}{{/if}}',
    '{{#let @model.posts as |blogPosts|}}{{blogPosts}}{{/let}}',
  ],
  invalid: [
    {
      code: '{{#with this.foo as |bar|}}{{bar}}{{/with}}',
      output: null,
      errors: [
        {
          message:
            'The use of the with helper has been deprecated. See https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax',
        },
      ],
    },
    {
      code: '{{#with (hash firstName="John" lastName="Doe") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}',
      output: null,
      errors: [
        {
          message:
            'The use of the with helper has been deprecated. See https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax',
        },
      ],
    },
  ],
});
