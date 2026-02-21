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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
      errors: [{ message: `Cannot use disallowed helper, component or modifier '{{component "foo"}}'` }],
    },
    {
      code: '<template>{{component "foo" foo=bar}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '{{component "foo"}}'` }],
    },
    {
      code: '<template>{{component "foo" foo=(baz)}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '{{component "foo"}}'` }],
    },
    {
      code: '<template>{{#component "foo"}}{{/component}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '{{#component "foo"}}'` }],
    },
    {
      code: '<template>{{#component "foo" foo=bar}}{{/component}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '{{#component "foo"}}'` }],
    },
    {
      code: '<template>{{#component "foo" foo=(baz)}}{{/component}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '{{#component "foo"}}'` }],
    },
    {
      code: '<template>{{yield (component "foo")}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '(component "foo")'` }],
    },
    {
      code: '<template>{{yield (component "foo" foo=bar)}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '(component "foo")'` }],
    },
    {
      code: '<template>{{yield (component "foo" foo=(baz))}}</template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: `Cannot use disallowed helper, component or modifier '(component "foo")'` }],
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
      errors: [{ message: "Cannot use disallowed helper, component or modifier '{{nested-scope/foo-bar}}'" }],
    },
    {
      code: '<template><NestedScope::FooBar/></template>',
      output: null,
      options: [['foo', 'nested-scope/foo-bar']],
      errors: [{ message: "Cannot use disallowed helper, component or modifier '<NestedScope::FooBar />'" }],
    },
  ],
});
