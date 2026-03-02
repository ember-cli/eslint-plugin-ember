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

    {
      code: '<template>{{foo/bar (component "foo/index")}}</template>',
      output: null,
      errors: [{ message: 'Replace `(component "foo/index" ...` to `(component "foo" ...`' }],
    },
    {
      code: '<template>{{foo/bar name=(component "foo/index")}}</template>',
      output: null,
      errors: [{ message: 'Replace `(component "foo/index" ...` to `(component "foo" ...`' }],
    },
    {
      code: '<template><Foo::Bar::Index /></template>',
      output: null,
      errors: [{ message: 'Replace `<Foo::Bar::Index ...` to `<Foo::Bar ...`' }],
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

hbsRuleTester.run('template-no-index-component-invocation', rule, {
  valid: [
    '<Foo::Bar />',
    '<Foo::IndexItem />',
    '<Foo::MyIndex />',
    '<Foo::MyIndex></Foo::MyIndex>',
    '{{foo/index-item}}',
    '{{foo/my-index}}',
    '{{foo/bar}}',
    '{{#foo/bar}}{{/foo/bar}}',
    '{{component "foo/bar"}}',
    '{{component "foo/my-index"}}',
    '{{component "foo/index-item"}}',
    '{{#component "foo/index-item"}}{{/component}}',
  ],
  invalid: [
    {
      code: '{{foo/index}}',
      output: null,
      errors: [
        { message: 'Replace `{{foo/index ...` to `{{foo ...`' },
      ],
    },
    {
      code: '{{component "foo/index"}}',
      output: null,
      errors: [
        { message: 'Replace `{{component "foo/index" ...` to `{{component "foo" ...`' },
      ],
    },
    {
      code: '{{#foo/index}}{{/foo/index}}',
      output: null,
      errors: [
        { message: 'Replace `{{#foo/index ...` to `{{#foo ...`' },
      ],
    },
    {
      code: '{{#component "foo/index"}}{{/component}}',
      output: null,
      errors: [
        { message: 'Replace `{{#component "foo/index" ...` to `{{#component "foo" ...`' },
      ],
    },
    {
      code: '{{foo/bar (component "foo/index")}}',
      output: null,
      errors: [
        { message: 'Replace `(component "foo/index" ...` to `(component "foo" ...`' },
      ],
    },
    {
      code: '{{foo/bar name=(component "foo/index")}}',
      output: null,
      errors: [
        { message: 'Replace `(component "foo/index" ...` to `(component "foo" ...`' },
      ],
    },
    {
      code: '<Foo::Index />',
      output: null,
      errors: [
        { message: 'Replace `<Foo::Index ...` to `<Foo ...`' },
      ],
    },
    {
      code: '<Foo::Bar::Index />',
      output: null,
      errors: [
        { message: 'Replace `<Foo::Bar::Index ...` to `<Foo::Bar ...`' },
      ],
    },
    {
      code: '<Foo::Index></Foo::Index>',
      output: null,
      errors: [
        { message: 'Replace `<Foo::Index ...` to `<Foo ...`' },
      ],
    },
  ],
});
