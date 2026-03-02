const rule = require('../../../lib/rules/template-no-args-paths');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-args-paths', rule, {
  valid: [
    '<template>{{@foo}}</template>',
    '<template><div @foo={{cleanup this.args}}></div></template>',
    '<template>{{foo (name this.args)}}</template>',
    '<template>{{foo name=this.args}}</template>',
    '<template>{{foo name=(extract this.args)}}</template>',
    '<template><Foo @params={{this.args}} /></template>',
    '<template><Foo {{mod this.args}} /></template>',
    '<template><Foo {{mod items=this.args}} /></template>',
    '<template><Foo {{mod items=(extract this.args)}} /></template>',
  ],
  invalid: [
    {
      code: '<template>{{@args.foo}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },

    {
      code: '<template>{{hello (format value=args.foo)}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{hello value=args.foo}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{hello (format args.foo.bar)}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template><br {{hello args.foo.bar}}></template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{hello args.foo.bar}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{args.foo.bar}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{args.foo}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{this.args.foo}}</template>',
      output: null,
      errors: [{ messageId: 'argsPath' }],
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

hbsRuleTester.run('template-no-args-paths', rule, {
  valid: [
    '<div @foo={{cleanup this.args}}></div>',
    '{{foo (name this.args)}}',
    '{{foo name=this.args}}',
    '{{foo name=(extract this.args)}}',
    '<Foo @params={{this.args}} />',
    '<Foo {{mod this.args}} />',
    '<Foo {{mod items=this.args}} />',
    '<Foo {{mod items=(extract this.args)}} />',
  ],
  invalid: [
    {
      code: '{{hello (format value=args.foo)}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '{{hello value=args.foo}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '{{hello (format args.foo.bar)}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '<br {{hello args.foo.bar}}>',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '{{hello args.foo.bar}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '{{args.foo.bar}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '{{args.foo}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
    {
      code: '{{this.args.foo}}',
      output: null,
      errors: [
        { message: 'Do not use paths with @args, use @argName directly instead.' },
      ],
    },
  ],
});
