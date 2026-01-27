const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-unused-block-params');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unused-block-params', rule, {
  valid: [
    // All params used
    '<template>{{#each items as |item|}}{{item.name}}{{/each}}</template>',
    '<template>{{#each items as |item index|}}{{index}}: {{item}}{{/each}}</template>',

    // No block params
    '<template>{{#each items}}{{this}}{{/each}}</template>',

    // Param used in nested path
    '<template>{{#let user as |u|}}{{u.name}}{{/let}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#each items as |item|}}Hello{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam', data: { param: 'item' } }],
    },
    {
      code: '<template>{{#each items as |item index|}}{{item}}{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam', data: { param: 'index' } }],
    },
    {
      code: '<template>{{#let value as |v|}}Something{{/let}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam', data: { param: 'v' } }],
    },
  ],
});
