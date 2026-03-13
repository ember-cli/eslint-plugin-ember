const rule = require('../../../lib/rules/template-no-args-paths');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-args-paths', rule, {
  valid: [
    '<template>{{@foo}}</template>',
    // @args.foo is a valid named argument, not a path violation
    '<template>{{@args.foo}}</template>',
    '<template><div @foo={{cleanup this.args}}></div></template>',
    '<template>{{foo (name this.args)}}</template>',
    '<template>{{foo name=this.args}}</template>',
    '<template>{{foo name=(extract this.args)}}</template>',
    '<template><Foo @params={{this.args}} /></template>',
    '<template><Foo {{mod this.args}} /></template>',
    '<template><Foo {{mod items=this.args}} /></template>',
    '<template><Foo {{mod items=(extract this.args)}} /></template>',
    // args as a block param is not flagged
    '<template>{{#each items as |args|}}{{args.name}}{{/each}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{hello (format value=args.foo)}}</template>',
      output: '<template>{{hello (format value=@foo)}}</template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{hello value=args.foo}}</template>',
      output: '<template>{{hello value=@foo}}</template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{hello (format args.foo.bar)}}</template>',
      output: '<template>{{hello (format @foo.bar)}}</template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template><br {{hello args.foo.bar}}></template>',
      output: '<template><br {{hello @foo.bar}}></template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{hello args.foo.bar}}</template>',
      output: '<template>{{hello @foo.bar}}</template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{args.foo.bar}}</template>',
      output: '<template>{{@foo.bar}}</template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{args.foo}}</template>',
      output: '<template>{{@foo}}</template>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<template>{{this.args.foo}}</template>',
      output: '<template>{{@foo}}</template>',
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
    // @args.foo is a valid named argument
    '{{@args.foo}}',
    '<div @foo={{cleanup this.args}}></div>',
    '{{foo (name this.args)}}',
    '{{foo name=this.args}}',
    '{{foo name=(extract this.args)}}',
    '<Foo @params={{this.args}} />',
    '<Foo {{mod this.args}} />',
    '<Foo {{mod items=this.args}} />',
    '<Foo {{mod items=(extract this.args)}} />',
    // args as a block param is not flagged
    '{{#each items as |args|}}{{args.name}}{{/each}}',
  ],
  invalid: [
    {
      code: '{{hello (format value=args.foo)}}',
      output: '{{hello (format value=@foo)}}',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '{{hello value=args.foo}}',
      output: '{{hello value=@foo}}',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '{{hello (format args.foo.bar)}}',
      output: '{{hello (format @foo.bar)}}',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '<br {{hello args.foo.bar}}>',
      output: '<br {{hello @foo.bar}}>',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '{{hello args.foo.bar}}',
      output: '{{hello @foo.bar}}',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '{{args.foo.bar}}',
      output: '{{@foo.bar}}',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '{{args.foo}}',
      output: '{{@foo}}',
      errors: [{ messageId: 'argsPath' }],
    },
    {
      code: '{{this.args.foo}}',
      output: '{{@foo}}',
      errors: [{ messageId: 'argsPath' }],
    },
  ],
});
