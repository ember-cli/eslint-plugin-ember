const rule = require('../../../lib/rules/template-no-args-paths');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-args-paths', rule, {
  valid: ['<template>{{@foo}}</template>'
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
