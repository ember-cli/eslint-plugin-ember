const rule = require('../../../lib/rules/template-no-dynamic-subexpression-invocations');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-dynamic-subexpression-invocations', rule, {
  valid: [
    '<template>{{format-date this.date}}</template>',
    '<template>{{(upper-case this.name)}}</template>',
    '<template>{{helper "static"}}</template>',

    '<template>{{something "here"}}</template>',
    '<template>{{something}}</template>',
    '<template>{{something here="goes"}}</template>',
    '<template><button onclick={{fn something "here"}}></button></template>',
    '<template>{{@thing "somearg"}}</template>',
    '<template><Foo @bar="asdf" /></template>',
    '<template><Foo @bar={{"asdf"}} /></template>',
    '<template><Foo @bar={{true}} /></template>',
    '<template><Foo @bar={{false}} /></template>',
    '<template><Foo @bar={{undefined}} /></template>',
    '<template><Foo @bar={{null}} /></template>',
    '<template><Foo @bar={{1}} /></template>',
    '<template>{{1}}</template>',
    '<template>{{true}}</template>',
    '<template>{{null}}</template>',
    '<template>{{undefined}}</template>',
    '<template>{{"foo"}}</template>',
  ],

  invalid: [
    {
      code: '<template>{{(this.helper "arg")}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use dynamic helper invocations. Use explicit helper names instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template>{{(@helperName "value")}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use dynamic helper invocations. Use explicit helper names instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template>{{this.formatter this.data}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use dynamic helper invocations. Use explicit helper names instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },

    {
      code: '<template><Foo bar="{{@thing "some-arg"}}" /></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><Foo {{this.foo}} /></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><Foo {{@foo}} /></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><Foo {{foo.bar}} /></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><button onclick={{@thing "some-arg"}}></button></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template>{{#let "whatever" as |thing|}}<button onclick={{thing "some-arg"}}></button>{{/let}}</template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><button onclick={{this.thing "some-arg"}}></button></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><button onclick={{lol.other.path "some-arg"}}></button></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template>{{if (this.foo) "true" "false"}}</template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><Foo @bar={{@thing "some-arg"}} /></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<template><Foo onclick={{@thing "some-arg"}} /></template>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
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

hbsRuleTester.run('template-no-dynamic-subexpression-invocations', rule, {
  valid: [
    '{{something "here"}}',
    '{{something}}',
    '{{something here="goes"}}',
    '<button onclick={{fn something "here"}}></button>',
    '{{@thing "somearg"}}',
    '<Foo @bar="asdf" />',
    '<Foo @bar={{"asdf"}} />',
    '<Foo @bar={{true}} />',
    '<Foo @bar={{false}} />',
    '<Foo @bar={{undefined}} />',
    '<Foo @bar={{null}} />',
    '<Foo @bar={{1}} />',
    '{{1}}',
    '{{true}}',
    '{{null}}',
    '{{undefined}}',
    '{{"foo"}}',
  ],
  invalid: [
    {
      code: '<Foo bar="{{@thing "some-arg"}}" />',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<Foo {{this.foo}} />',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<Foo {{@foo}} />',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<Foo {{foo.bar}} />',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<button onclick={{@thing "some-arg"}}></button>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '{{#let "whatever" as |thing|}}<button onclick={{thing "some-arg"}}></button>{{/let}}',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<button onclick={{this.thing "some-arg"}}></button>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<button onclick={{lol.other.path "some-arg"}}></button>',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '{{if (this.foo) "true" "false"}}',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<Foo @bar={{@thing "some-arg"}} />',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
    {
      code: '<Foo onclick={{@thing "some-arg"}} />',
      output: null,
      errors: [
        { message: 'Do not use dynamic helper invocations. Use explicit helper names instead.' },
      ],
    },
  ],
});
