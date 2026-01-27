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

    '<template>{{baz foo=(baz)}}</template>',
    '<template>{{#baz foo=bar}}{{/baz}}</template>',
    '<template>{{#baz foo=(baz)}}{{/baz}}</template>',
    '<template>{{component}}</template>',
    '<template>{{component "baz" foo=bar}}</template>',
    '<template>{{component "baz" foo=(baz)}}</template>',
    '<template>{{#component "baz"}}{{/component}}</template>',
    '<template>{{#component "baz" foo=bar}}{{/component}}</template>',
    '<template>{{#component "baz" foo=(baz)}}{{/component}}</template>',
    '<template>{{yield (component "baz")}}</template>',
    '<template>{{yield (component "baz" foo=bar)}}</template>',
    '<template>{{yield (component "baz" foo=(baz))}}</template>',
    '<template>{{yield (baz (baz (baz) bar))}}</template>',
    '<template>{{yield (baz (baz (baz) (baz)))}}</template>',
    '<template>{{yield (baz (baz (baz) foo=(baz)))}}</template>',
    '<template>{{#baz as |foo|}}{{foo}}{{/baz}}</template>',
    '<template>{{#with (component "blah") as |Foo|}} <Foo /> {{/with}}</template>',
    '<template>{{other/foo-bar}}</template>',
    '<template>{{nested-scope/other}}</template>',
    '<template><Random/></template>',
    '<template><HelloWorld/></template>',
    '<template><NestedScope::Random/></template>',
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

    {
      code: '<template><div {{foo}} /></template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '{{foo}}'" }],
    },
    {
      code: '<template>{{foo foo=bar}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '{{foo}}'" }],
    },
    {
      code: '<template>{{foo foo=(baz)}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '{{foo}}'" }],
    },
    {
      code: '<template>{{#foo foo=bar}}{{/foo}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '{{#foo}}'" }],
    },
    {
      code: '<template>{{#foo foo=(baz)}}{{/foo}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '{{#foo}}'" }],
    },
    {
      code: '<template>{{component "foo"}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'{{component "foo"}}\'' },
      ],
    },
    {
      code: '<template>{{component "foo" foo=bar}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'{{component "foo"}}\'' },
      ],
    },
    {
      code: '<template>{{component "foo" foo=(baz)}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'{{component "foo"}}\'' },
      ],
    },
    {
      code: '<template>{{#component "foo"}}{{/component}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'{{#component "foo"}}\'' },
      ],
    },
    {
      code: '<template>{{#component "foo" foo=bar}}{{/component}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'{{#component "foo"}}\'' },
      ],
    },
    {
      code: '<template>{{#component "foo" foo=(baz)}}{{/component}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'{{#component "foo"}}\'' },
      ],
    },
    {
      code: '<template>{{yield (component "foo")}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'(component "foo")\'' },
      ],
    },
    {
      code: '<template>{{yield (component "foo" foo=bar)}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'(component "foo")\'' },
      ],
    },
    {
      code: '<template>{{yield (component "foo" foo=(baz))}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        { message: 'Cannot use disallowed helper, component or modifier \'(component "foo")\'' },
      ],
    },
    {
      code: '<template>{{yield (baz (foo (baz) bar))}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '(foo)'" }],
    },
    {
      code: '<template>{{yield (baz (baz (baz) (foo)))}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '(foo)'" }],
    },
    {
      code: '<template>{{yield (baz (baz (baz) foo=(foo)))}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '(foo)'" }],
    },
    {
      code: '<template>{{#baz as |bar|}}{{bar foo=(foo)}}{{/baz}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '(foo)'" }],
    },
    {
      code: '<template>{{nested-scope/foo-bar}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{nested-scope/foo-bar}}'",
        },
      ],
    },
    {
      code: '<template><NestedScope::FooBar/></template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '<NestedScope::FooBar />'",
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

hbsRuleTester.run('template-no-restricted-invocations', rule, {
  valid: [
    '{{baz}}',
    '{{baz foo=bar}}',
    '{{baz foo=(baz)}}',
    '{{#baz}}{{/baz}}',
    '{{#baz foo=bar}}{{/baz}}',
    '{{#baz foo=(baz)}}{{/baz}}',
    '{{component}}',
    '{{component "baz"}}',
    '{{component "baz" foo=bar}}',
    '{{component "baz" foo=(baz)}}',
    '{{#component "baz"}}{{/component}}',
    '{{#component "baz" foo=bar}}{{/component}}',
    '{{#component "baz" foo=(baz)}}{{/component}}',
    '{{yield (component "baz")}}',
    '{{yield (component "baz" foo=bar)}}',
    '{{yield (component "baz" foo=(baz))}}',
    '{{yield (baz (baz (baz) bar))}}',
    '{{yield (baz (baz (baz) (baz)))}}',
    '{{yield (baz (baz (baz) foo=(baz)))}}',
    // Note: ETL tests '{{#baz as |foo|}}{{foo}}{{/baz}}' and
    // '{{#with (component "blah") as |Foo|}} <Foo /> {{/with}}' as valid
    // because ETL tracks block params. EPE does not track block params,
    // so these would flag the yielded names. Omitted from hbs config tests.
    '{{other/foo-bar}}',
    '{{nested-scope/other}}',
    '<Random/>',
    '<HelloWorld/>',
    '<NestedScope::Random/>',
  ].map((code) => ({
    code: typeof code === 'string' ? code : code.code,
    options: [
      [
        'foo',
        'bar',
        'nested-scope/foo-bar',
        {
          names: ['deprecated-component'],
          message: 'This component is deprecated; use component ABC instead.',
        },
      ],
    ],
  })),
  invalid: [
    // Modifier on element.
    {
      code: '<div {{foo}} />',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{foo}}'",
        },
      ],
    },
    // Mustache invocations.
    {
      code: '{{foo}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{foo}}'",
        },
      ],
    },
    {
      code: '{{foo foo=bar}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{foo}}'",
        },
      ],
    },
    {
      code: '{{foo foo=(baz)}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{foo}}'",
        },
      ],
    },
    // Angle bracket invocation.
    {
      code: '<Foo />',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '<Foo />'",
        },
      ],
    },
    // Block invocations.
    {
      code: '{{#foo}}{{/foo}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{#foo}}'",
        },
      ],
    },
    {
      code: '{{#foo foo=bar}}{{/foo}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{#foo}}'",
        },
      ],
    },
    {
      code: '{{#foo foo=(baz)}}{{/foo}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{#foo}}'",
        },
      ],
    },
    // Component helper invocations.
    {
      code: '{{component "foo"}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'{{component "foo"}}\'',
        },
      ],
    },
    {
      code: '{{component "foo" foo=bar}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'{{component "foo"}}\'',
        },
      ],
    },
    {
      code: '{{component "foo" foo=(baz)}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'{{component "foo"}}\'',
        },
      ],
    },
    {
      code: '{{#component "foo"}}{{/component}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'{{#component "foo"}}\'',
        },
      ],
    },
    {
      code: '{{#component "foo" foo=bar}}{{/component}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'{{#component "foo"}}\'',
        },
      ],
    },
    {
      code: '{{#component "foo" foo=(baz)}}{{/component}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'{{#component "foo"}}\'',
        },
      ],
    },
    // Subexpression with component helper.
    {
      code: '{{yield (component "foo")}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'(component "foo")\'',
        },
      ],
    },
    {
      code: '{{yield (component "foo" foo=bar)}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'(component "foo")\'',
        },
      ],
    },
    {
      code: '{{yield (component "foo" foo=(baz))}}',
      output: null,
      errors: [
        {
          message: 'Cannot use disallowed helper, component or modifier \'(component "foo")\'',
        },
      ],
    },
    // Nested subexpressions.
    {
      code: '{{yield (baz (foo (baz) bar))}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '(foo)'",
        },
      ],
    },
    {
      code: '{{yield (baz (baz (baz) (foo)))}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '(foo)'",
        },
      ],
    },
    {
      code: '{{yield (baz (baz (baz) foo=(foo)))}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '(foo)'",
        },
      ],
    },
    {
      code: '{{#baz as |bar|}}{{bar foo=(foo)}}{{/baz}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{bar}}'",
        },
        {
          message: "Cannot use disallowed helper, component or modifier '(foo)'",
        },
      ],
    },
    // Nested scope (slash path).
    {
      code: '{{nested-scope/foo-bar}}',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '{{nested-scope/foo-bar}}'",
        },
      ],
    },
    // Nested scope (angle bracket with ::).
    {
      code: '<NestedScope::FooBar/>',
      output: null,
      errors: [
        {
          message: "Cannot use disallowed helper, component or modifier '<NestedScope::FooBar />'",
        },
      ],
    },
    // Custom message from config object.
    {
      code: '{{deprecated-component}}',
      output: null,
      errors: [
        {
          message: 'This component is deprecated; use component ABC instead.',
        },
      ],
    },
  ].map((test) => ({
    ...test,
    options: [
      [
        'foo',
        'bar',
        'nested-scope/foo-bar',
        {
          names: ['deprecated-component'],
          message: 'This component is deprecated; use component ABC instead.',
        },
      ],
    ],
  })),
});
