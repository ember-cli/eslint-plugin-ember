const rule = require('../../../lib/rules/template-no-index-component-invocation');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-index-component-invocation', rule, {
  valid: [
    '<template><Foo::Bar /></template>',
    '<template><Foo::IndexItem /></template>',
    '<template><Foo::MyIndex /></template>',
    '<template><Foo::MyIndex></Foo::MyIndex></template>',
    '<template>{{foo/index-item}}</template>',
    '<template>{{foo/my-index}}</template>',
    '<template>{{foo/bar}}</template>',
    '<template>{{#foo/bar}}{{/foo/bar}}</template>',
    '<template>{{component "foo/bar"}}</template>',
    '<template>{{component "foo/my-index"}}</template>',
    '<template>{{component "foo/index-item"}}</template>',
    '<template>{{#component "foo/index-item"}}{{/component}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{foo/index}}</template>',
      output: null,
      errors: [
        {
          message: 'Replace `{{foo/index ...` to `{{foo ...`',
        },
      ],
    },
    {
      code: '<template>{{component "foo/index"}}</template>',
      output: null,
      errors: [
        {
          message: 'Replace `{{component "foo/index" ...` to `{{component "foo" ...`',
        },
      ],
    },
    {
      code: '<template>{{#foo/index}}{{/foo/index}}</template>',
      output: null,
      errors: [
        {
          message: 'Replace `{{#foo/index ...` to `{{#foo ...`',
        },
      ],
    },
    {
      code: '<template>{{#component "foo/index"}}{{/component}}</template>',
      output: null,
      errors: [
        {
          message: 'Replace `{{#component "foo/index" ...` to `{{#component "foo" ...`',
        },
      ],
    },
    {
      code: '<template><Foo::Index /></template>',
      output: null,
      errors: [
        {
          message: 'Replace `<Foo::Index ...` to `<Foo ...`',
        },
      ],
    },
    {
      code: '<template><Foo::Index></Foo::Index></template>',
      output: null,
      errors: [
        {
          message: 'Replace `<Foo::Index ...` to `<Foo ...`',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{foo/bar (component "foo/index")}}</template>',
      output: null,
      errors: [{ message: 'Replace `{{foo/index ...` to `{{foo ...`' }],
    },
    {
      code: '<template>{{foo/bar name=(component "foo/index")}}</template>',
      output: null,
      errors: [{ message: 'Replace `{{foo/index ...` to `{{foo ...`' }],
    },
    {
      code: '<template><Foo::Bar::Index /></template>',
      output: null,
      errors: [{ message: 'Replace `{{foo/index ...` to `{{foo ...`' }],
    },
  ],
});
