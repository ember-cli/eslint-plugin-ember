const rule = require('../../../lib/rules/template-no-extra-mut-helper-argument');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-extra-mut-helper-argument', rule, {
  valid: [
    '<template>{{my-component click=(action (mut isClicked))}}</template>',
    '<template>{{my-component click=(action (mut isClicked) true)}}</template>',
    '<template>{{my-component isClickedMutable=(mut isClicked)}}</template>',
    '<template><button {{action (mut isClicked)}}></button></template>',
    '<template><button {{action (mut isClicked) true}}></button></template>',
  ],
  invalid: [
    {
      code: '<template>{{my-component click=(action (mut isClicked true))}}</template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.',
        },
      ],
    },
    {
      code: '<template>{{my-component isClickedMutable=(mut isClicked true)}}</template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.',
        },
      ],
    },
    {
      code: '<template><button {{action (mut isClicked true)}}></button></template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.',
        },
      ],
    },
  ],
});
