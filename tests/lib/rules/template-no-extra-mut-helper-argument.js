const rule = require('../../../lib/rules/template-no-extra-mut-helper-argument');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-extra-mut-helper-argument', rule, {
  valid: [
    '<template>{{my-component click=(fn (mut isClicked))}}</template>',
    '<template>{{my-component click=(fn (mut isClicked) true)}}</template>',
    '<template>{{my-component isClickedMutable=(mut isClicked)}}</template>',
    '<template><button {{on "click" (fn (mut isClicked))}}></button></template>',
    '<template><button {{on "click" (fn (mut isClicked) true)}}></button></template>',
  ],
  invalid: [
    {
      code: '<template>{{my-component click=(fn (mut isClicked true))}}</template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
    },
    {
      code: '<template>{{my-component isClickedMutable=(mut isClicked true)}}</template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
    },
    {
      code: '<template><button {{on "click" (fn (mut isClicked true))}}></button></template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
    },
    // `mut` is an ambient strict-mode keyword, so this reports in gjs/gts as well
    {
      filename: 'test.gjs',
      code: '<template>{{yield (mut @a @b)}}</template>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
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

hbsRuleTester.run('template-no-extra-mut-helper-argument', rule, {
  valid: [
    '{{my-component click=(fn (mut isClicked))}}',
    '{{my-component click=(fn (mut isClicked) true)}}',
    '{{my-component isClickedMutable=(mut isClicked)}}',
    '<button {{on "click" (fn (mut isClicked))}}></button>',
    '<button {{on "click" (fn (mut isClicked) true)}}></button>',
  ],
  invalid: [
    {
      code: '{{my-component click=(fn (mut isClicked true))}}',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
    },
    {
      code: '{{my-component isClickedMutable=(mut isClicked true)}}',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
    },
    {
      code: '<button {{on "click" (fn (mut isClicked true))}}></button>',
      output: null,
      errors: [
        {
          message:
            'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(fn (mut attr) value)`.',
        },
      ],
    },
  ],
});
